import { createStore } from 'vuex';

export default createStore({
  state: {
    activeNetwork: {},
  },
  mutations: {
    updateNetwork(state, newValue) {
      state.activeNetwork = newValue;
    },
  },
  actions: {},
  getters: {},
});
