import { createStore } from 'vuex'
import { callBackend } from './commons'
import { omit } from 'lodash'

const state = {
  loading: false,
  confirm: {
    visible: false,
    content: '',
    confirmed: () => {}
  },
  logined: {
    token: '',
    account: '',
    avatar: ''
  }
}

const mutations = {
  SHOW_LOADING (state, payload) {
    state.loading = payload
  },
  UPDATE_LOGINED (state, payload) {
    state.logined = {
      token: payload.token,
      user: payload.logined,
      account: payload.logined.username || payload.logined.phone,
    }
  },
  SHOW_CONFIRM (state, payload: { show: boolean, content?: string, confirmed: () => void }) {
    state.confirm.visible = payload.show
    state.confirm.content = payload.content || ''
    state.confirm.confirmed = () => {
      payload.confirmed && payload.confirmed()
      state.confirm.visible = false
    }
  }
}

const actions = {
  showLoading (ctx, show: boolean) {
    ctx.commit('SHOW_LOADING', show)
  },
  async login (ctx, form) {
    ctx.commit('UPDATE_LOGINED', await callBackend(
      '/super-salty/api/v1/user/log/in', 'POST', form
    ))
  },
  async regup (ctx, form) {
    await callBackend('/super-salty/api/v1/user/reg/up', 'POST', form)
    return ctx.dispatch('login', form)
  },
  showConfirm (ctx, options: { content?: string, confirmed?: () => void }) {
    ctx.commit('SHOW_CONFIRM', { show: true, ...options })
  },
  hideConfirm (ctx) {
    ctx.commit('SHOW_CONFIRM', { show: false })
  }
}

const getters = {
  isLoading (state) {
    return state.loading
  },
  isConfirming (state) {
    return state.confirm.visible
  },
  confirmContent (state) {
    return state.confirm.content
  },
  confirmCallback (state) {
    return state.confirm.confirmed
  },
  logined (state) {
    return omit(state.logined, ['token'])
  },
  lgnToken (state) {
    return state.logined.token
  }
}

const store = createStore({
  state,
  mutations,
  actions,
  getters
})

export default store
