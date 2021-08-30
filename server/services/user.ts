import { Context } from 'koa'
import { Model } from '../lib/databases/index.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import * as utils from '../utils/index.js'

const db = await utils.getDatabase()
const svrCfg = utils.getServerInfo()

export async function login (ctx: Context, model: Model, key: string): Promise<void> {
  const reqBody = ctx.request.body

  const result = await db.select(model, {
    [key]: reqBody[key]
  })
  if(!result.length) {
    ctx.body = { error: '用户名不存在' }
    return
  }
  const user = result[0]

  const reqPwd = crypto.createHmac('sha256', svrCfg.secret)
    .update(reqBody.password).digest('hex')
  if (reqPwd !== user.password) {
    ctx.body = { error: '错误的登录密码' }
    return
  }

  const payload: jwt.JwtPayload = {
    sub: 'login',
    aud: user._id,
    iat: Date.now(),
    jti: uuidv4(),
    iss: svrCfg.admin,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 1 day
  }
  const logined = user.toObject()
  delete logined.password
  ctx.body = {
    result: {
      logined,
      token: jwt.sign(payload, svrCfg.secret),
      message: '登录成功！'
    }
  }
}

export async function logstat (ctx: Context): Promise<void> {
  const reqQuery = ctx.request.query

  const token = <string>reqQuery.token
  if(!token) {
    ctx.body = { error: '未登录' }
    return
  }

  const resBody = await new Promise(res => {
    jwt.verify(token, svrCfg.secret, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined): void => {
      if (err) {
        res({
          error: `登录token验证失败：${err.inner || JSON.stringify(err)}`
        })
      } else {
        res({
          result: {
            message: '验证通过', payload: decoded
          }
        })
      }
    })
  })
  ctx.body = resBody
}

export async function regup (ctx: Context, model: Model, key: string): Promise<void> {
  const reqBody = ctx.request.body

  const stored = await db.select(model, {
    [key]: reqBody[key]
  })
  if (stored.length) {
    ctx.body = {
      error: '用户名已经存在'
    }
    return
  }

  const result = await db.save(model, reqBody)
  if(typeof result === 'string') {
    ctx.body = {
      error: `持久化用户数据失败：${result}`
    }
  } else {
    ctx.body = {result}
  }
}
