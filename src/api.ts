import { callBackend } from './commons'

export function getIdenGood (goodId: string): Promise<any> {
  return callBackend(`/super-salty/mdl/v1/good/${goodId}`, 'GET')
}

export function getAllGoods (): Promise<any> {
  return callBackend(`/super-salty/mdl/v1/goods`, 'GET')
}

export function addNewGood (form: any): Promise<any> {
  return callBackend('/super-salty/mdl/v1/good', 'POST', form)
}

export function genNewOrder (form: any): Promise<any> {
  return callBackend('/super-salty/mdl/v1/order', 'POST', form)
}

export function getAllMessages () {
  return require('./resources/messages.json').data
}

export function getAllNews () {
  return require('./resources/news.json').data
}

export function getUserByIdx (index: string): Promise<any> {
  return callBackend(`/super-salty/mdl/v1/user/${index}`, 'GET')
}
