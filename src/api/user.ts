import { callBackend } from '../utils'

export function login (form: any) {
  return callBackend('/super-salty/api/v1/user/log/in', 'POST', form)
}

export function getAccount () {
  return require('../resources/account.json').data
}