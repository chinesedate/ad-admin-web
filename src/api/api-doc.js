import request from '@/utils/request'

export function fetchDocList(data) {
  return request({
    url: '/api/project/list',
    method: 'post',
    data
  })
}

export function addDoc(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  })
}
