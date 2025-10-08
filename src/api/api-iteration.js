import request from '@/utils/request'

export function fetchIterationList(data) {
  return request({
    url: '/api/project/list',
    method: 'post',
    data
  })
}

export function addIteration(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  })
}
