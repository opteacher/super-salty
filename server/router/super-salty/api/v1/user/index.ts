import _ from 'lodash'
import Router from 'koa-router'
import User from '../../../../../models/user.js'
import Good from '../../../../../models/good.js'
import { login, logstat, regup } from '../../../../../services/user.js'
import Redis from '../../../../../lib/databases/redis.js'
import * as utils from '../../../../../utils/index.js'

const db = await utils.getDatabase()
const redis = new Redis('../configs/db')
const router = new Router()

router.post('/log/in', ctx => login(ctx, User, 'phone'))

router.get('/log/stat', ctx => logstat(ctx))

router.post('/reg/up', ctx => regup(ctx, User, 'phone'))

router.get('/:uid/messages', async ctx => {
  const res = await db.select(Good, { owner: ctx.params.uid })
  const keys = res.map((good: any) => `${good._index}.*`).concat(`*.${ctx.params.uid}`)
  const result = await Promise.all(keys.map((key: string) => redis.get(key, [], { operType: 'keys' })))
  ctx.body = {
    result: _.flatten(result),
  }
})

export default router
