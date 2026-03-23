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

/**
 * 查询广告渠道信息列表
 */
export function pageListAdChannel(data) {
  return request({
    url: '/track/admin/ad-channel-list',
    method: 'post',
    data
  })
}

/**
 * 获取广告渠道信息筛选列表
 */
export function fetchAdChannelPickInfo(data) {
  return request({
    url: '/track/admin/ad-channel-pick',
    method: 'post',
    data
  })
}

/**
 * 更新广告渠道信息
 */
export function saveAdChannelInfo(data) {
  return request({
    url: '/track/admin/ad-channel',
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
 * 获取广告渠道标识筛选列表
 */
export function fetchAdChannelCodeList(data) {
  return request({
    url: '/track/admin/ad-channel-code-list',
    method: 'post',
    data
  })
}

/**
 * 查询广告链接列表
 */
export function pageListAdLink(data) {
  return request({
    url: '/track/admin/adv-link-list',
    method: 'post',
    data
  })
}

/**
 * 添加广告主链接
 */
export function addAdvLink(data) {
  return request({
    url: '/track/admin/adv-link',
    method: 'post',
    data
  });
}

/**
 * 删除广告主链接
 */
export function removeAdvLink(id) {
  return request({
    url: `/track/admin/adv-link//${id}`,
    method: 'delete'
  });
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
