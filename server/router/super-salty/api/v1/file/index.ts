import fs from 'fs'
import path from 'path'
import { File } from 'formidable'
import Router from 'koa-router'
import { uploadToQiniu, RespCode } from '../../../../../services/cdn.js'

const router = new Router()

router.post('/', async ctx => {
  if (!ctx.request.files) {
    return ctx.body = {
      error: {
        message: 'No file uploaded!',
        code: RespCode.NO_FILES_UPLOADED
      }
    }
  }
  const flPath = (<File>ctx.request.files.file).path
  const key = ctx.request.body.key || path.parse(flPath).base
  ctx.body = {
    result: await uploadToQiniu(key, fs.createReadStream(flPath))
  }
})

export default router
