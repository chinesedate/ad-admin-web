import request from '@/utils/request'

/**
 * 获取待审核问答信息列表
 * @param data 查询条件
 */
export function listAuditQaInfo(data) {
  return request({
    url: '/api/adm/audit/qa/list',
    method: 'post',
    data
  })
}

/**
 * 获取待审核问答信息
 * @param id 待审核问答信息id
 */
export function fetchAuditQaInfo(id) {
  return request({
    url: `/api/adm/audit/qa/${id}`,
    method: 'get'
  })
}

/**
 * 审核问答信息
 * @param data 问答信息
 */
export function auditQa(data) {
  return request({
    url: `/api/adm/audit/qa`,
    method: 'put',
    data
  })
}

/**
 * 获取待审核问答回复列表
 * @param data 查询条件
 */
export function listAuditQaAnswer(data) {
  return request({
    url: '/api/adm/audit/qa-answer/list',
    method: 'post',
    data
  })
}

/**
 * 获取待审核问答回复信息
 * @param id 待审核问答回复信息id
 */
export function fetchAuditQaAnswer(id) {
  return request({
    url: `/api/adm/audit/qa-answer/${id}`,
    method: 'get'
  })
}

/**
 * 审核问答回复信息
 * @param data 问答回复信息
 */
export function auditQaAnswer(data) {
  return request({
    url: `/api/adm/audit/qa-answer`,
    method: 'put',
    data
  })
}

/**
 * 获取待审核问答标签页列表
 * @param data 查询条件
 */
export function listAuditQaTab(data) {
  return request({
    url: '/api/adm/audit/qa-tab/list',
    method: 'post',
    data
  })
}

/**
 * 获取待审核问答标签页信息
 * @param id 待审核问答标签页id
 */
export function fetchAuditQaTab(id) {
  return request({
    url: `/api/adm/audit/qa-tab/${id}`,
    method: 'get'
  })
}

/**
 * 审核问答标签页信息
 * @param data 问答标签页信息
 */
export function auditQaTab(data) {
  return request({
    url: `/api/adm/audit/qa-tab`,
    method: 'put',
    data
  })
}

/**
 * 获取待审核问答工具列表
 * @param data 查询条件
 */
export function listAuditQaTool(data) {
  return request({
    url: '/api/adm/audit/qa-tool/list',
    method: 'post',
    data
  })
}

/**
 * 获取待审核问答工具信息
 * @param id 待审核问答工具id
 */
export function fetchAuditQaTool(id) {
  return request({
    url: `/api/adm/audit/qa-tool/${id}`,
    method: 'get'
  })
}

/**
 * 审核问答工具信息
 * @param data 问答工具信息
 */
export function auditQaTool(data) {
  return request({
    url: `/api/adm/audit/qa-tool`,
    method: 'put',
    data
  })
}
