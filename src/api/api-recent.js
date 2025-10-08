import request from '@/utils/request'

export function fetchRecentList(data) {
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
