import store from './store'
import Taro from '@tarojs/taro'

const bkHost = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:4000'

interface Response {
  data: any
  statusCode: number
}

export async function callBackend (
  path: string,
  method: string,
  params: any = {},
  options: any = {},
  succeedMsg: string = 'Request succeed!'
) {
  store.dispatch('showLoading', true)
  let resp: Response = await Taro.request({
    url: bkHost + path,
    data: params,
    method,
    dataType: 'json',
    header: options
  }).catch(err => {
    Taro.atMessage({
      message: err.error, type: 'error'
    })
    return Promise.reject()
  })
  store.dispatch('showLoading', false)
  if (!resp.data) {
    Taro.atMessage({
      message: '返回体没有data字段！', type: 'error'
    })
    return Promise.reject()
  }
  if (resp.statusCode !== 200) {
    Taro.atMessage({
      message: resp.data.error.message, type: 'error'
    })
    return Promise.reject()
  }
  if (!resp.data.data && !resp.data.result) {
    Taro.atMessage({
      message: resp.data.error || JSON.stringify(resp.data), type: 'error'
    })
    return Promise.reject()
  }
  Taro.atMessage({
    message: succeedMsg, type: 'success'
  })
  return Promise.resolve(resp.data.data || resp.data.result)
} 

export function validateForm (
  form: any,
  rules: any,
  fields: string[] = []
): [string, string] {
  if (!fields.length) {
    fields = Object.keys(form)
  }
  for (const key of fields) {
    const value = form[key]
    const rule = rules[key]
    if (rule.required) {
      if (!value.length) {
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
      switch (typeof value) {
        case 'string':
          if (rule.max < value.length) {
            return errRet
          }
          break
        default:
          if (rule.max < value) {
            return errRet
          }
      }
    }
    if (rule.min) {
      const errRet: [string, string] = [
        key, `${key} smaller than min value ${rule.min}!`
      ]
      switch (typeof value) {
        case 'string':
          if (rule.min > value.length) {
            return errRet
          }
          break
        default:
          if (rule.min > value) {
            return errRet
          }
      }
    }
    if (rule.enum && rule.enum.length) {
      if (rule.enum.includes(value)) {
        return [key, `${key} not one of ${rule.enum}!`]
      }
    }
  }
  return ['', '']
}