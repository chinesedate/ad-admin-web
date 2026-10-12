import request from '@/utils/request'

/**
 * 用户列表（含角色与数据范围）
 */
export function sysUserList() {
    return request({
        url: '/track/admin/sys-user-list',
        method: 'post'
    })
}

/**
 * 数据范围候选值（渠道 / 广告主）
 */
export function dataScopeOptions() {
    return request({
        url: '/track/admin/data-scope-options',
        method: 'get'
    })
}

/**
 * 保存用户角色
 * @param data {user_id, role_codes: []}
 */
export function saveUserRole(data) {
    return request({
        url: '/track/admin/sys-user-role',
        method: 'put',
        data
    })
}

/**
 * 保存用户数据范围
 * @param data {user_id, scopes: {channel_code: [], customer_id: []}}
 */
export function saveUserDataScope(data) {
    return request({
        url: '/track/admin/sys-user-data-scope',
        method: 'put',
        data
    })
}
