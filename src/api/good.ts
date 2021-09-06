import { callBackend } from '../commons'

export function getIdenGood (goodId: string): Promise<any> {
  return callBackend(`/super-salty/mdl/v1/good/${goodId}`, 'GET')
}

export function getAllGoods (): Promise<any> {
  return callBackend(`/super-salty/mdl/v1/goods`, 'GET')
}

export function addNewGood (form: any): Promise<any> {
  return callBackend('/super-salty/mdl/v1/good', 'POST', form)
}
