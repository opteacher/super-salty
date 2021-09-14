import path from 'path'
import Router from 'koa-router'
import { readConfig } from '../../../../../lib/utils/index.js'
import { cfgPath } from '../../../../../utils/index.js'

const router = new Router()

router.get('/redis', async ctx => {
  ctx.body = {
    result: readConfig(path.resolve(cfgPath, 'db'), true).redis
  }
})

export default router
