import { callBackend, copyGood, copyUser, Good, User } from './commons'

export async function getIdenGood (goodId: string): Promise<Good> {
  return copyGood(await callBackend(`/super-salty/mdl/v1/good/${goodId}`, 'GET'))
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

export function getAllMessages (topic: string) {
  return callBackend(`/super-salty/api/v1/message/topic/${topic}/s`, 'GET', {}, {
    showLoading: false, showTipText: false
  }).then(ress => ress.map(res => JSON.parse(res)))
}

export function getAllMsgsByUsr (usrIdx: string) {
  return callBackend(`/super-salty/api/v1/user/${usrIdx}/messages`, 'GET')
}

export function addMessage (message: any) {
  return callBackend(`/super-salty/api/v1/message/topic/${message.topic}`, 'POST',
    { message: JSON.stringify(message) }, { showLoading: false })
}

export function getAllNews () {
  return require('./resources/news.json').data
}

export async function getUserByIdx (index: string): Promise<User> {
  return copyUser(await callBackend(`/super-salty/mdl/v1/user/${index}`, 'GET'))
}
