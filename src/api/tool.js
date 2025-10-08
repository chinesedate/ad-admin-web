import request from '@/utils/request'

/**
 * 获取工具分类信息列表
 * @param data 查询条件
 */
export function listToolCategory(data) {
  return request({
    url: '/api/tool/category/list',
    method: 'post',
    data
  })
}

/**
 * 分页获取工具分类信息列表
 * @param data 分页查询查询条件
 */
export function pageListToolCategory(data) {
  return request({
    url: '/api/tool/category/page',
    method: 'post',
    data
  })
}

/**
 * 获取工具列表
 * @param data 分页查询条件  参数字段示例 {toolCategoryLabelIdMap:[{categoryId:[labelId]}]}
 */
export function pageListTool(data) {
  return request({
    url: '/api/tool/search',
    method: 'post',
    data
  })
}

/**
 * 添加工具信息
 * @param data 工具信息
 */
export function addTool(data) {
  return request({
    url: '/api/tool',
    method: 'post',
    data
  })
}

/**
 * 添加工具分类信息
 * @param data 工具分类信息
 */
export function addToolCategory(data) {
  return request({
    url: '/api/tool/category',
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
