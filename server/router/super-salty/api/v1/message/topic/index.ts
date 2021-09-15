import Router from 'koa-router'
import Redis from '../../../../../../lib/databases/redis.js'

const redis = new Redis('../configs/db')
const router = new Router()

router.post('/:topic', async ctx => {
  ctx.body = {
    result: await redis.set(
      ctx.params.topic,
      ctx.request.body.message,
      { operType: 'lPush' }
    )
  }
})

router.put('/:topic/index/:lindex', async ctx => {
  ctx.body = {
    result: await redis.set(
      ctx.params.topic,
      [ctx.params.lindex, ctx.request.body.message],
      { operType: 'lSet' }
    )
  }
})

router.get('/:topic/index/:lindex', async ctx => {
  ctx.body = {
    result: await redis.get(
      ctx.params.topic,
      [ctx.params.lindex],
      { operType: 'lIndex' }
    )
  }
})

router.get('/:topic/s', async ctx => {
  ctx.body = {
    result: await redis.get(
      ctx.params.topic,
      [0, -1], { operType: 'LRANGE' }
    )
  }
})

export default router
