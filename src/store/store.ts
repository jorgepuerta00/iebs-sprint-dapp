import { createStore } from 'vuex';
import state from './state'

const store = createStore({
  strict: true,
  state,
  mutations: {},
  actions: {},
  getters: {},
});

export default store;