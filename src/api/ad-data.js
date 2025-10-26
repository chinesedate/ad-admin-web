import request from '@/utils/request'

/**
 * 获取待审核问题信息列表
 * @param data 查询条件
 */
export function pageListAdData(data) {
  return request({
    url: '/track/admin/ad-data-list',
    method: 'post',
    data
  })
}

export function fetchAdDataPickInfo(data) {
  return request({
    url: '/track/admin/ad-data-pick',
    method: 'post',
    data
  })
}

export function exportAdData(data) {
  return request({
    url: '/track/admin/ad-data/export',
    method: 'post',
    responseType: 'blob',
    data
  })
}

/**
 * 获取待审核问题信息
 * @param id 待审核问题id
 */
export function fetchAuditIssue(id) {
  return request({
    url: `/api/adm/audit/issue/${id}`,
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
 * 审核问答信息
 * @param data 工具信息
 */
export function auditIssue(data) {
  return request({
    url: `/api/adm/audit/issue`,
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
