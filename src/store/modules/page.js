import {getApiState, setApiState} from "@/utils/state";

const state = {
  apiPageState: getApiState()
}

const mutations = {
  SET_PAGE_STATE: (state, data) => {
    state.apiPageState = data
  }
}

const actions = {
  setApiPageState({commit}, pageState) {
    return new Promise(resolve => {
      let pageStateStr = JSON.stringify(pageState);
      setApiState(pageStateStr)
      commit('SET_PAGE_STATE', pageStateStr)
      resolve()
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
