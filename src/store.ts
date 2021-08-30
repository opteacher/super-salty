import { createStore } from 'vuex'

const state = {
  loading: false
}

const mutations = {
  SHOW_LOADING (state, payload) {
    state.loading = payload
  }
}

const actions = {
  showLoading (context, show) {
    context.commit('SHOW_LOADING', show)
  }
}

const getters = {
  isLoading (state) {
    return state.loading
  }
}

const store = createStore({
  state,
  mutations,
  actions,
  getters
})

export default store
