import store from './store'
import Taro from '@tarojs/taro'
import { reactive, ref } from 'vue'

export const bkHost = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:4000'

interface Response {
  data: any
  statusCode: number
}

interface PropInit<T> {
  default?: T
  rule?: ValidFieldRule
}

export interface IndexStruct<T = any> {
  [prop: string]: PropInit<T> | any
}

export interface IndexString {
  [prop: string]: string
}

// required: true, 必填选项
// pattern: /^\w$/ 【字符串专有】匹配的正则，如果为字符串，则直接判断是否相等
// length: 10, 【字符串专有】要求的字符串长度
// max: 10, 最大的值（如果是字符串则为最大长度）
// min: 0, 最小的值（如果是字符串则为最小长度）
// enum: [], 给出值必须是其中的一项
export interface ValidFieldRule {
  required?: boolean
  pattern?: string | RegExp
  length?: number
  max?: number
  min?: number
  enum?: string[]
}

export interface ValidFieldRules {
  [field: string]: ValidFieldRule
}

export class FormState {
  form: IndexStruct
  rules: any
  errMsgs: IndexString
  focusComp: any

  constructor (attrs: IndexStruct, focusComp?: string) {
    const errMsgs: IndexString = {}
    const form: IndexStruct = {}
    const rules: ValidFieldRules = {}
    for (const [key, value] of Object.entries(attrs)) {
      const propInit = <PropInit<any>>value
      if (typeof propInit.default !== 'undefined') {
        form[key] = propInit.default
      }
      errMsgs[key] = ''
      if (propInit.rule) {
        rules[key] = propInit.rule
      }
    }
    this.form = reactive(form)
    this.rules = reactive(rules)
    this.errMsgs = reactive(errMsgs)
    this.focusComp = ref(focusComp || '')
  }

  public toQueryString (): string {
    const queryItems: string[] = []
    for (const [key, value] of Object.entries(this.form)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          queryItems.push(`${key}=${item}`)
        }
      } else {
        queryItems.push(`${key}=${value}`)
      }
    }
    return queryItems.join('&')
  }

  public toRefs (): IndexStruct {
    return {
      form: this.form,
      rules: this.rules,
      errMsgs: this.errMsgs,
      focusComp: this.focusComp,

      validateForm: this.validateForm,
      onFieldChanged: this.onFieldChanged,
    }
  }

  public onFieldChanged (key: string, val: any) {
    const chkRes = this.validateForm({ [key]: val })
    if (chkRes[0].length) {
      this.errMsgs[chkRes[0]] = chkRes[1]
    } else {
      this.errMsgs[key] = ''
    }
    this.focusComp = key
    return val
  }

  public validateForm (fields?: IndexStruct): [string, string] {
    if (!fields) {
      fields = this.form
    }
    for (const [key, value] of Object.entries(fields)) {
      const rule = this.rules[key]
      if (!rule) {
        continue
      }
      if (rule.required) {
        if (!value || value.length === 0) {
          return [key, `${key} is required!`]
        }
      }
      if (rule.pattern) {
        const errRet: [string, string] = [
          key, `${key}'s format check failed!`
        ]
        switch (typeof rule.pattern) {
          case 'string':
            if (rule.pattern !== value) {
              return errRet
            }
            break
          default:
            if (!rule.pattern.test(value)) {
              return errRet
            }
        }
      }
      if (rule.length) {
        if (rule.length !== value.length) {
          return [key, `${key}'s length not equal to ${rule.length}!`]
        }
      }
      if (rule.max) {
        const errRet: [string, string] = [
          key, `${key} larger than max value ${rule.max}!`
        ]
        const type = typeof value
        if ((type === 'string' || type === 'object') && value.length) {
          if (rule.max < value.length) {
            return errRet
          }
        } else {
          if (rule.max < value) {
            return errRet
          }
        }
      }
      if (rule.min) {
        const errRet: [string, string] = [
          key, `${key} smaller than min value ${rule.min}!`
        ]
        const type = typeof value
        if ((type === 'string' || type === 'object') && value.length) {
          if (rule.min > value.length) {
            return errRet
          }
        } else {
          if (rule.min > value) {
            return errRet
          }
        }
      }
      if (rule.enum && rule.enum.length) {
        if (!rule.enum.includes(value)) {
          return [key, `${key} not one of ${rule.enum}!`]
        }
      }
    }
    return ['', '']
  }
}

export interface CallBkedOpns {
  showLoading?: boolean
  showTipText?: boolean
}

export async function callBackend (
  path: string,
  method: keyof Taro.request.method | undefined,
  params: any = {},
  options: CallBkedOpns = {
    showLoading: true,
    showTipText: true
  },
  succeedMsg: string = 'Request succeed!'
) {
  if (options.showLoading) {
    store.dispatch('showLoading', true)
  }
  let error = {
    message: '', code: 200
  }
  let resp: Response
  try {
    resp = await Taro.request({
      url: bkHost + path,
      data: params,
      method,
      dataType: 'json',
      header: options
    })
  } catch (err) {
    error.message = err.message || JSON.stringify(err)
    if (options.showTipText) {
      Taro.atMessage({
        message: error.message, type: 'error'
      })
    }
    return Promise.reject(error)
  } finally {
    if (options.showLoading) {
      store.dispatch('showLoading', false)
    }
  }
  error.code = resp.statusCode
  if (!resp.data) {
    error.message = '返回体没有data字段！'
  }
  if (resp.statusCode !== 200) {
    error.message = resp.data.error.message
  }
  if (!resp.data.data && !resp.data.result) {
    error = resp.data.error || resp.data
  }
  if (error.message.length) {
    if (options.showTipText) {
      Taro.atMessage({
        message: error.message, type: 'error'
      })
    }
    return Promise.reject(error)
  } else {
    if (options.showTipText) {
      Taro.atMessage({
        message: succeedMsg, type: 'success'
      })
    }
    return Promise.resolve(resp.data.data || resp.data.result)
  }
}

export async function uploadImage (callback?: (progress: number) => void): Promise<string> {
  const res = await Taro.chooseImage({
    count: 1
  })
  store.dispatch('showLoading', true)
  return new Promise((resolve, reject) => {
    const uploadTask = Taro.uploadFile({
      url: `${bkHost}/super-salty/api/v1/file`,
      filePath: res.tempFilePaths[0],
      name: 'file',
      success (res) {
        const data = JSON.parse(res.data)
        resolve(data.result)
      },
      fail: reject,
      complete () {
        store.dispatch('showLoading', false)
      }
    })
    uploadTask.progress((res) => {
      callback && callback(res.progress)
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })
  })
}

export function isStartsWith (text: string, prefix: string): boolean {
  return text.substring(0, prefix.length) === prefix
}

export function isEndsWith (text: string, suffix: string): boolean {
  return text.substring(text.length - suffix.length) === suffix
}

export function rmvEndsOf (text: string, suffix: string): string {
  const index = text.indexOf(suffix)
  return index !== -1 ? text.substring(0, index) : text
}

interface BasicIndex {
  _index?: string
}
export interface User extends BasicIndex {
  account: string
  username: string
  phone: string
  avatar: string
}

export function newUser (): User {
  return {
    account: '',
    username: '',
    phone: '',
    avatar: 'http://cdn.opteacher.top/super-salty/assets/images/my_light.png',
  }
}

export function copyUser (src: any, tgt?: User): User {
  tgt = tgt || newUser()
  tgt._index = src._index
  tgt.avatar = src.avatar
  tgt.phone = src.phone
  tgt.username = src.username
  tgt.account = src.username || src.phone
  return tgt
}

export interface Good extends BasicIndex {
  owner: User
  cover: string
  name: string
  location: string
  price: number
  unit: string
  desc: string
  images: string[]
  tags?: string[]
  viewed: number
  liked: number
}

export function newGood (): Good {
  return {
    owner: newUser(),
    cover: '',
    name: '',
    location: '',
    price: 0,
    unit: '',
    desc: '',
    images: [],
    tags: [],
    viewed: 0,
    liked: 0
  }
}

export function copyGood (src: any, tgt?: Good): Good {
  tgt = tgt || newGood()
  tgt._index = src._index
  copyUser(src.owner, tgt.owner)
  tgt.cover = src.cover
  tgt.name = src.name
  tgt.location = src.location
  tgt.price = src.price
  tgt.unit = src.unit
  tgt.desc = src.desc
  tgt.images = src.images
  tgt.tags = src.tags || []
  tgt.viewed = src.viewed
  tgt.liked = src.liked
  return tgt
}

export interface Message extends BasicIndex {
  topic: string
  content: string
  sender: User
  createdAt?: Date
}

export function newMessage (): Message {
  return {
    topic: '',
    content: '',
    sender: newUser()
  }
}

export function copyMessage (src: any, tgt?: Message): Message {
  tgt = tgt || newMessage()
  tgt._index = src._index || undefined
  if (src.sender._index) {
    copyUser(src.sender, tgt.sender)
  } else {
    tgt.sender = src.sender
  }
  tgt.topic = src.topic
  tgt.content = src.content
  tgt.createdAt = src.createdAt || new Date()
  return tgt
}

export type OrderStatus = 'WaitForSend' | 'Sending' | 'WaitForReceive' | 'Received' | 'WaitForEvaluate' | 'Returned' | 'Closed'
export interface Order extends BasicIndex {
  price: number
  tags?: string[]
  good: Good
  buyer: User
  status: OrderStatus
  delivery?: string
  createdAt?: Date
  updatedAt?: Date
}

export function copyOrder (src: any, tgt: Order): Order {
  tgt._index = src._index
  copyGood(src.good, tgt.good)
  copyUser(src.buyer, tgt.buyer)
  tgt.price = src.price
  tgt.tags = src.tags
  tgt.status = src.status
  tgt.delivery = src.delivery
  tgt.createdAt = src.createdAt
  tgt.updatedAt = src.updatedAt
  return tgt
}
