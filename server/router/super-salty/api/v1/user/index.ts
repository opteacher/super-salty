import Router from 'koa-router'
import User from '../../../../../models/user.js'
import { login, logstat, regup } from '../../../../../services/user.js'

const router = new Router()

router.post('/log/in', ctx => login(ctx, User.model, 'phone'))

router.get('/log/stat', ctx => logstat(ctx))

router.post('/reg/up', ctx => regup(ctx, User.model, 'phone'))

export default router
