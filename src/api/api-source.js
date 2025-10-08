import request from '@/utils/request'

export function fetchSourceList(data) {
  return request({
    url: '/api/source/list',
    method: 'post',
    data
  })
}

export function addSource(data) {
  return request({
    url: '/api/source',
    method: 'post',
    data
  })
}

/**
 * 获取api源信息
 * @param id api源信息id
 */
export function fetchSource(id) {
  return request({
    url: `/api/source/${id}`,
    method: 'get'
  })
}

/**
 * 删除api源信息
 * @param id api源信息id
 */
export function removeSource(id) {
  return request({
    url: `/api/source/${id}`,
    method: 'delete'
  });
}

export function pullSourceApi(data) {
  return request({
    url: '/api/source/pull',
    method: 'post',
    data,
    headers: {"content-type": "multipart/form-data"}
  })
}

/**
 * 获取源api内容列表
 * @param data 分页请求参数
 */
export function fetchSourceContentList(data) {
  return request({
    url: '/api/source/content',
    method: 'post',
    data
  })
}

/**
 * 获取源api内容标签信息
 * @param data 分页请求参数
 */
export function fetchSourceContentTree(data) {
  return request({
    url: '/api/source/content/tree',
    method: 'post',
    data
  })
}
