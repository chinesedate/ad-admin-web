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
    url: `/track/admin/adv-link/${id}`,
    method: 'delete'
  });
}

/**
 * 查询广告主链接
 */
export function getAdvLink(id) {
  return request({
    url: `/track/admin/adv-link/${id}`,
    method: 'get'
  });
}

/**
 * 更新广告主链接信息
 */
export function updateAdvLink(data) {
  return request({
    url: '/track/admin/adv-link',
    method: 'put',
    data
  })
}

/**
 * 添加媒体链接
 */
export function addMediaLink(data) {
  return request({
    url: '/track/admin/media-link',
    method: 'post',
    data,
    skipGlobalError: true
  });
}

/**
 * 查询媒体链接列表
 */
export function pageListMediaLink(data) {
  return request({
    url: '/track/admin/media-link-list',
    method: 'post',
    data
  })
}

/**
 * 更新媒体链接信息
 */
export function updateMediaLink(data) {
  return request({
    url: '/track/admin/media-link',
    method: 'put',
    data,
    skipGlobalError: true
  })
}

/**
 * 删除媒体链接
 */
export function removeMediaLink(id) {
  return request({
    url: `/track/admin/media-link/${id}`,
    method: 'delete'
  });
}

export function pageListAdvMedia(data) {
  return request({
    url: '/track/admin/adv-media-list',
    method: 'post',
    data
  })
}

export function addAdvMedia(data) {
  return request({
    url: '/track/admin/adv-media',
    method: 'post',
    data
  })
}

export function updateAdvMedia(data) {
  return request({
    url: '/track/admin/adv-media',
    method: 'put',
    data
  })
}

export function removeAdvMedia(id) {
  return request({
    url: `/track/admin/adv-media/${id}`,
    method: 'delete'
  })
}

export function fetchAdvLinkParam(channelCode) {
  return request({
    url: `/track/admin/adv-link-param/${encodeURIComponent(channelCode)}`,
    method: 'get'
  })
}

export function saveAdvLinkParam(data) {
  return request({
    url: '/track/admin/adv-link-param',
    method: 'put',
    data
  })
}

export function fetchMediaLinkParam(channelCode) {
  return request({
    url: `/track/admin/media-link-param/${encodeURIComponent(channelCode)}`,
    method: 'get'
  })
}

export function saveMediaLinkParam(data) {
  return request({
    url: '/track/admin/media-link-param',
    method: 'put',
    data
  })
}

export function pageListAdvChannelUpDown(data) {
  return request({
    url: '/track/admin/adv-channel-up-down-list',
    method: 'post',
    data
  })
}

export function addAdvChannelUpDown(data) {
  return request({
    url: '/track/admin/adv-channel-up-down',
    method: 'post',
    data
  })
}

export function updateAdvChannelUpDown(data) {
  return request({
    url: '/track/admin/adv-channel-up-down',
    method: 'put',
    data
  })
}

export function removeAdvChannelUpDown(id) {
  return request({
    url: `/track/admin/adv-channel-up-down/${id}`,
    method: 'delete'
  })
}

export function pageListAdvChannelAction(data) {
  return request({
    url: '/track/admin/adv-channel-action-list',
    method: 'post',
    data
  })
}

export function addAdvChannelAction(data) {
  return request({
    url: '/track/admin/adv-channel-action',
    method: 'post',
    data
  })
}

export function updateAdvChannelAction(data) {
  return request({
    url: '/track/admin/adv-channel-action',
    method: 'put',
    data
  })
}

export function removeAdvChannelAction(id) {
  return request({
    url: `/track/admin/adv-channel-action/${id}`,
    method: 'delete'
  })
}
