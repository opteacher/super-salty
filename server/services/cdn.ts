import axios from 'axios'
import path from 'path'
import qiniu from 'qiniu'
import { URL } from 'url'
import { readConfig } from '../lib/utils/index.js'

export enum RespCode {
  NO_FILES_UPLOADED = 5000
}

export async function uploadToQiniu (
  key: string, readableStream: NodeJS.ReadableStream
): Promise<string> {
  const qnCfg = readConfig(path.resolve('../configs/cdn'))
  const mac = new qiniu.auth.digest.Mac(qnCfg.accessKey, qnCfg.secretKey)

  const config = new qiniu.conf.Config({
    zone: qiniu.zone.Zone_z2
  })

  const url = `http://cdn.opteacher.top/${key}`
  let needRefresh = false
  try {
    const resp = await axios.get(new URL(url).href)
    needRefresh = resp.status === 200
  } catch (e) {}

  const putPolicy = new qiniu.rs.PutPolicy({
    scope: `${qnCfg.bucket}:${key}`
  })
  const uploadToken = putPolicy.uploadToken(mac)

  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  await new Promise((res, rej) => {
    formUploader.putStream(uploadToken, key, readableStream, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        rej(respErr)
      }
      if (respInfo.statusCode == 200) {
        res(respBody)
      } else {
        console.log(respInfo.statusCode)
        rej(respBody)
      }
    })
  })
  if (needRefresh) {
    // 刷新缓存
    const cdnManager = new qiniu.cdn.CdnManager(mac)
    await new Promise((res: Function, rej: Function) => {
      cdnManager.refreshUrls([url], function (err) {
        err ? rej(err) : res()
      })
    })
  }
  return Promise.resolve(url)
}
