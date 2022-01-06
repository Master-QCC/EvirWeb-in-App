/* jshint esversion: 6 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
Vue.use(Vuex)

const Store = new Vuex.Store({
  state,
  mutations
})
export default Store
