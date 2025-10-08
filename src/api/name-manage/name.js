import request from '@/utils/request'

/**
 * 添加名称来源信息
 * @param data 名称来源数据
 */
export function newNameSource(data) {
  return request({
    url: '/api/adm/name/source',
    method: 'post',
    data
  })
}

/**
 * 删除名称来源信息
 * @param sourceId 名称来源id
 */
export function removeNameSource(sourceId) {
  return request({
    url: `/api/adm/name/source/${sourceId}`,
    method: 'delete'
  })
}

/**
 * 更新名称来源信息
 * @param data 名称来源信息
 */
export function modifyNameSource(data) {
  return request({
    url: '/api/adm/name/source',
    method: 'put',
    data
  })
}

/**
 * 分页查询查询推荐名称来源列表
 * @param data 查询条件
 */
export function listSuggestNameSource(data) {
  return request({
    url: '/api/adm/name//source-suggest/list',
    method: 'post',
    data
  })
}


/**
 * 分页查询查询名称来源列表
 * @param data 查询条件
 */
export function listNameSource(data) {
  return request({
    url: '/api/adm/name/source/list',
    method: 'post',
    data
  })
}

/**
 * 分页查询名称来源标签列表
 * @param data 查询条件
 */
export function listNameSourceTab(data) {
  return request({
    url: '/api/adm/name/source-tab/list',
    method: 'post',
    data
  })
}

/**
 * 添加名称来源标签信息
 * @param data 名称来源标签信息
 */
export function newNameSourceTab(data) {
  return request({
    url: '/api/adm/name/source-tab',
    method: 'post',
    data
  })
}

/**
 * 删除名称来源标签信息
 * @param tabId 名称来源标签id
 */
export function removeNameSourceTab(tabId) {
  return request({
    url: `/api/adm/name/source-tab/${tabId}`,
    method: 'delete'
  })
}

/**
 * 添加名称信息
 * @param data 名称信息
 */
export function newName(data) {
  return request({
    url: '/api/adm/name/info',
    method: 'post',
    data
  })
}

/**
 * 删除名称信息
 * @param nameId 名称id
 */
export function removeName(nameId) {
  return request({
    url: `/api/adm/name/info/${nameId}`,
    method: 'delete'
  })
}


/**
 * 查询名称列表
 * @param data 查询条件
 */
export function listNameInfo(data) {
  return request({
    url: '/api/adm/name/info/list',
    method: 'post',
    data
  })
}

/**
 * 更新名称来源信息推荐状态
 * @param data 名称来源信息
 */
export function modifyNameSourceSuggestStatus(data) {
  return request({
    url: '/api/adm/name/source-suggest',
    method: 'put',
    data
  })
}

/**
 * 更新名称来源信息激活状态
 */
export function modifyNameSourceActiveStatus(data) {
  return request({
    url: '/api/adm/name/source-active',
    method: 'put',
    data
  })
}

/**
 * 数据排序
 * @param data 排序参数
 */
export function dataSort(data) {
  return request({
    url: '/api/adm/name/sort',
    method: 'post',
    data
  })
}
