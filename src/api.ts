import { callBackend, copyGood, copyMessage, copyOrder, copyUser, Good, Message, Order, User } from './commons'

export async function getIdenGood (goodId: string, output: Good): Promise<Good> {
  return callBackend(`/super-salty/mdl/v1/good/${goodId}`, 'GET').then(res => {
    return output ? copyGood(res, output) : copyGood(res)
  })
}

export function getAllGoods (): Promise<any> {
  return callBackend(`/super-salty/mdl/v1/goods`, 'GET')
}

export function getGoodsByOwner (uid: string): Promise<Good[]> {
  return callBackend('/super-salty/mdl/v1/goods', 'GET', { owner: uid })
    .then(ress => ress.map(res => copyGood(res)))
}

export function addNewGood (form: any): Promise<any> {
  return callBackend('/super-salty/mdl/v1/good', 'POST', form)
}

export function genNewOrder (form: any): Promise<any> {
  return callBackend('/super-salty/mdl/v1/order', 'POST', form)
}

export function getOrder (index: string, output?: Order): Promise<Order> {
  return callBackend(`/super-salty/mdl/v1/order/${index}`, 'GET').then(res => {
    return output ? copyOrder(res, output) : copyOrder(res)
  })
}

export function updateOrder (index: string, form: any): Promise<any> {
  return callBackend(`/super-salty/mdl/v1/order/${index}`, 'PUT', form)
}

export function getOrdersByUser (uid: string): Promise<Order[]> {
  return callBackend(`/super-salty/api/v1/user/${uid}/orders`, 'GET')
    .then(ress => ress.map(res => copyOrder(res)))
}

export function getAllMessages (topic: string): Promise<Message[]> {
  return callBackend(`/super-salty/api/v1/message/topic/${topic}/s`, 'GET', {}, {
    showLoading: false, showTipText: false
  }).then(ress => ress
    .map((res, idx) => copyMessage(Object.assign({ index: idx }, JSON.parse(res))))
    .sort((m1, m2) => m1.createdAt > m2.createdAt ? 1 : -1)
  )
}

export function getAllMsgsByUsr (usrIdx: string) {
  return callBackend(`/super-salty/api/v1/user/${usrIdx}/messages`, 'GET')
}

export function addMessage (message: any) {
  return callBackend(`/super-salty/api/v1/message/topic/${message.topic}`, 'POST',
    { message: JSON.stringify(message) }, { showLoading: false })
}

export function setMessage (lindex: number, message: Message) {
  return callBackend(`/super-salty/api/v1/message/topic/${message.topic}/index/${lindex}`, 'PUT',
    { message: JSON.stringify(message) })
}

export function getMessage (lindex: number, topic: string): Promise<Message> {
  return callBackend(`/super-salty/api/v1/message/topic/${topic}/index/${lindex}`, 'GET')
    .then(res => JSON.parse(res))
    .then(copyMessage)
}

export function getAllNews () {
  return require('./resources/news.json').data
}

export function getUserByIdx (index: string, output?: User): Promise<User> {
  return callBackend(`/super-salty/mdl/v1/user/${index}`, 'GET').then(res => {
    return output ? copyUser(res, output) : copyUser(res)
  })
}
