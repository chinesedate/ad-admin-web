import {SET_CHOOSE_LABEL} from '../mutation-types'
const state = {
    chooseLabel: ''
}

const mutations = {
    [SET_CHOOSE_LABEL]: (state, data) => {
        state.chooseLabel = data.chooseLabel
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
