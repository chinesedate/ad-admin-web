import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken, setRefreshToken} from '@/utils/auth'
import router from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  // 权限点编码列表，含 '*' 表示全权限（超级管理员）
  permissions: [],
  // 是否已拉取过用户权限信息，避免每次路由跳转都请求
  permissionsLoaded: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_PERMISSIONS_LOADED: (state, loaded) => {
    state.permissionsLoaded = loaded
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password, verifyCode} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password, verifyCode: verifyCode}).then(res => {
        const {data} = res
        // 存储用户token
        commit('SET_TOKEN', data.data.access_token)
        setToken(data.data.access_token)
        // 存储refresh token
        commit('SET_REFRESH_TOKEN', data.data.access_token)
        setRefreshToken(data.data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取当前用户的角色与权限点
  getInfo({commit}) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        // 响应拦截器返回的是 axios response，后端响应体是 res.data，业务数据在 res.data.data
        const payload = res.data && res.data.data

        if (!payload) {
          reject('获取用户信息失败，请重新登录')
          return
        }

        commit('SET_NAME', payload.username || '')
        commit('SET_ROLES', payload.role_codes || [])
        commit('SET_PERMISSIONS', payload.perm_codes || [])
        commit('SET_PERMISSIONS_LOADED', true)
        resolve(payload)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  // eslint-disable-next-line no-unused-vars
  logout({commit, state, dispatch}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        commit('SET_PERMISSIONS_LOADED', false)
        removeToken()
        router.push('/login')

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      commit('SET_PERMISSIONS_LOADED', false)
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
