import request from '@/utils/request'

export function fetchProjectList(data) {
  return request({
    url: '/api/project/list',
    method: 'post',
    data
  })
}

export function addProject(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: {id}
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: {pv}
  })
}

export function addArticle(data) {
  return request({
    url: '/api/platform/article',
    method: 'post',
    data
  })
}
