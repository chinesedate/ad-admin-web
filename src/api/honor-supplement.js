import request from '@/utils/request'

export function pageHonorSupplement(data) {
  return request({
    url: '/track/admin/honor-supplement/list',
    method: 'post',
    data
  })
}

export function sendHonorSupplement(data) {
  return request({
    url: '/track/admin/honor-supplement/send',
    method: 'post',
    data
  })
}
