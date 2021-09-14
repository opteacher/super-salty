import { Context } from 'koa'
import { MdlInf } from '../lib/databases/index.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import * as utils from '../utils/index.js'

const db = await utils.getDatabase()
const svrCfg = utils.getServerInfo()

export enum RespCode {
  NO_SUCH_USER = 4000,
  WRONG_PASSWORD,
  UNLOGINED,
  WRONG_TOKEN,
  USER_EXISTS,
  DB_OPER_FAILED,
}

export async function login (ctx: Context, model: MdlInf, key: string): Promise<void> {
  const reqBody = ctx.request.body

  const result = await db.select(model, {
    [key]: reqBody[key]
  })
  if(!result.length) {
    ctx.body = {
      error: { message: '用户名不存在', code: RespCode.NO_SUCH_USER }
    }
    return
  }
  const user = result[0]

  const reqPwd = crypto.createHmac('sha256', svrCfg.secret)
    .update(reqBody.password).digest('hex')
  if (reqPwd !== user.password) {
    ctx.body = {
      error: { message: '错误的登录密码', code: RespCode.WRONG_PASSWORD }
    }
    return
  }

  const payload: jwt.JwtPayload = {
    sub: 'login',
    aud: user._index,
    iat: Date.now(),
    jti: uuidv4(),
    iss: svrCfg.admin,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 1 day
  }
  delete user.password
  ctx.body = {
    result: {
      logined: user,
      token: jwt.sign(payload, svrCfg.secret),
      message: '登录成功！'
    }
  }
}

export async function logstat (ctx: Context): Promise<void> {
  const reqQuery = ctx.request.query

  const token = <string>reqQuery.token
  if(!token) {
    ctx.body = {
      error: { message: '未登录', code: RespCode.UNLOGINED }
    }
    return
  }

  const resBody = await new Promise(res => {
    jwt.verify(token, svrCfg.secret, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined): void => {
      if (err) {
        res({
          error: {
            code: RespCode.WRONG_TOKEN,
            message: `登录token验证失败：${err.inner || JSON.stringify(err)}`
          }
        })
      } else {
        res({
          result: { message: '验证通过', payload: decoded }
        })
      }
    })
  })
  ctx.body = resBody
}

export async function regup (ctx: Context, model: MdlInf, key: string): Promise<void> {
  const reqBody = ctx.request.body

  const stored = await db.select(model, {
    [key]: reqBody[key]
  })
  if (stored.length) {
    ctx.body = {
      error: { message: '用户名已经存在', code: RespCode.USER_EXISTS }
    }
    return
  }

  const result = await db.save(model, reqBody)
  if(typeof result === 'string') {
    ctx.body = {
      error: {
        message: `持久化用户数据失败：${result}`,
        code: RespCode.DB_OPER_FAILED
      }
    }
  } else {
    ctx.body = { result }
  }
}
