import request from '@/utils/request'

/**
 * 获取待审核工具信息列表
 * @param data 查询条件
 */
export function listAuditTool(data) {
  return request({
    url: '/api/adm/audit/tool/list',
    method: 'post',
    data
  })
}

/**
 * 获取待审核工具信息
 * @param id 待审核工具id
 */
export function fetchAuditTool(id) {
  return request({
    url: `/api/adm/audit/tool/${id}`,
    method: 'get'
  })
}

/**
 * 统计待审核工具数量
 */
export function countAuditTool() {
  return request({
    url: '/api/adm/audit/tool/count',
    method: 'get'
  })
}

/**
 * 获
 * @param data 工具信息
 */
export function auditTool(data) {
  return request({
    url: `/api/adm/audit/tool`,
    method: 'put',
    data
  })
}

/**
 * 获取待审核工具分类信息列表
 * @param data 查询条件
 */
export function listAuditToolCategory(data) {
  return request({
    url: '/api/adm/audit/tool/list',
    method: 'post',
    data
  })
}

/**
 * 统计待审核工具分类数量
 */
export function countAuditToolCategory() {
  return request({
    url: '/api/adm/audit/category/count',
    method: 'get'
  })
}

// region 审核编辑数据
/**
 * 获取待审核编辑信息列表
 * @param data 查询条件
 */
export function listAuditModifyData(data) {
  return request({
    url: '/api/adm/audit/modify-data/list',
    method: 'post',
    data
  })
}

/**
 * 获取待审核编辑数据信息
 * @param id 待审核编辑数据id
 */
export function fetchModifyData(id) {
  return request({
    url: `/api/adm/audit/modify-data/${id}`,
    method: 'get'
  })
}

/**
 * 获
 * @param data 工具信息
 */
export function auditModifyData(data) {
  return request({
    url: `/api/adm/audit/modify-data`,
    method: 'put',
    data
  })
}

// endregion
