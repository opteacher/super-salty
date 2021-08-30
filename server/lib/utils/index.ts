import fs from 'fs'
import path from 'path'
import toml from 'toml'
import axios from 'axios'
import qiniu from 'qiniu'
import { URL } from 'url'

// @block{scanPath}:扫描指定目录和子目录
// @type:function
// @includes:lodash
// @includes:fs
// @includes:path
// @params{dirPath}[string]:指定的目录
// @params{options}[object]:扫描方式
//          * *ignores*[```array```]：忽略的目录和文件
//          * *ext*[```string```]：匹配的文件格式
// @return{subPathAry}[array]:扫描出来的文件（带相对路径）
export function scanPath (dirPath: string, options: {
  ignores?: string[], ext?: string, orgPath?: string
}): string[] {
  // @steps{1}:参数配置，默认扫描方式为空
  if (!options) {
    options = {}
  }
  if (!options.ignores) {
    options.ignores = []
  }
  if (options.ext) {
    if (options.ext[0] !== '.') {
      options.ext = '.' + options.ext
    }
    options.ext = options.ext.toLowerCase()
  }
  if (!options.orgPath) {
    options.orgPath = dirPath
  }

  // @steps{2}:扫描当前目录下所有子目录和文件
  let subPathAry: string[] = []
  for (const file of fs.readdirSync(dirPath)) {
    const absPth = path.join(dirPath, file)
    const relPth = absPth.replace(`${options.orgPath}${path.sep}`, '')
    const fstat = fs.statSync(absPth)
    if (fstat.isDirectory()) {
      // @steps{2_1}:如果是目录，递归调用并把返回值合并进返回值中
      subPathAry = subPathAry.concat(scanPath(absPth, options))
    } else if (fstat.isFile()) {
      const pthInfo = path.parse(relPth)
        // @steps{2_2}:如果是文件，查看是否指定忽略
      let bIgnore = false
      for (const ignore of options.ignores) {
        if (ignore[0] === '*') {
          // @steps{2_2_1}:如果文件名为*，则检查文件后缀
          const ext = ignore.slice(1)
          if (pthInfo.ext === ext) {
            bIgnore = true
          }
        } else {
          // @steps{2_2_2}:如果忽略的是目录，查看相对路径的前ignore\
          //         长度的字符串是否相等
          //         ```
          //         ignore -> node_modules/
          //         relPth -> node_modules/koa/Readme.md
          //         ```
          let pth = relPth
          if (relPth.length > ignore.length) {
            pth = relPth.slice(0, ignore.length)
          }
          // @_steps{2_2_3}:如果忽略的是文件，查看相对路径的后ignore\
          //         长度的字符串是否相等
          //         ```
          //         ignore -> Readme.md
          //         relPth -> node_modules/koa/Readme.md
          //         ```
          // if(pth === ignore) { bIgnore = true }
          // if(relPth.length > ignore.length) {
          //   pth = relPth.slice(-ignore.length)
          // }
          if (pth === ignore) {
            bIgnore = true
          }
        }
      }
      let extMatch = true
      if (options.ext) {
        extMatch = pthInfo.ext.toLowerCase() === options.ext
      }
      // @steps{2_3}:最后把子文件路径塞入返回值中
      if (!bIgnore && extMatch) {
        subPathAry.push(relPth)
      }
    }
  }
  return subPathAry
}

export function readConfig (cfgFile: string, withEnv = false): any {
  const env = withEnv && process.env.ENV ? `.${process.env.ENV}` : ''
  return toml.parse(fs.readFileSync(`${cfgFile}${env}.toml`, { encoding: 'utf8' }))
}

export function fixStartsWith (text: string, prefix: string): string {
  return (text.substring(0, prefix.length) !== prefix ? prefix : '') + text
}

export function fixEndsWith (text: string, suffix: string): string {
  return text + (text.substring(text.length - suffix.length) !== suffix ? suffix : '')
}

export function rmvEndsOf (text: string, suffix: string): string {
  const index = text.indexOf(suffix)
  return index !== -1 ? text.substring(0, index) : text
}

export function getErrContent (err: any): string {
  let ret: string
  if(typeof err === 'string') {
    ret = err
  } else if(err.message && typeof err.message === 'string') {
    ret = err.message
  } else if(err.content && typeof err.content === 'string') {
    ret = err.content
  } else {
    ret = JSON.stringify(err)
  }
  return ret
}

export async function uploadToQiniu (cfgPath: string, key: string, readableStream: NodeJS.ReadableStream): Promise<string> {
  const qnCfg = readConfig(cfgPath)
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