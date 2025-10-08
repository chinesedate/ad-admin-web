import Cookies from 'js-cookie'

const ApiStateKey = 'Api-State'

export function getApiState() {
  return Cookies.get(ApiStateKey)
}

export function setApiState(token) {
  return Cookies.set(ApiStateKey, token)
}

export function removeApiState() {
  return Cookies.remove(ApiStateKey)
}
