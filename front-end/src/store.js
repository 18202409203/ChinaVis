import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ip: 'http://219.216.80.193:8086',
    currentPage: '',
  },
  mutations: {
    currentPageChange(state, str){
      state.currentPage = str
    }
  },
  actions: {

  }
})
