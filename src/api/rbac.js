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
 * 数据范围候选值（渠道 / 广告主 / 客户 / 应用）
 * @param params {channel_codes: 'a,b', advertiser_codes: 'c,d'} 传已选值用于联动过滤客户与应用
 */
export function dataScopeOptions(params) {
    return request({
        url: '/track/admin/data-scope-options',
        method: 'get',
        params
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

/**
 * 新建用户
 * @param data {username, password, role_codes: [], state}  password 传 md5 后的值
 */
export function createSysUser(data) {
    return request({
        url: '/track/admin/sys-user',
        method: 'post',
        data
    })
}

/**
 * 修改用户密码
 * @param data {user_id, password}  password 传 md5 后的值
 */
export function saveUserPassword(data) {
    return request({
        url: '/track/admin/sys-user-password',
        method: 'put',
        data
    })
}

/**
 * 删除用户
 * @param userId
 */
export function deleteSysUser(userId) {
    return request({
        url: `/track/admin/sys-user/${userId}`,
        method: 'delete'
    })
}

/**
 * 全量权限点字典（页面 + 页内按钮）
 */
export function permissionList() {
    return request({
        url: '/track/admin/permission-list',
        method: 'get'
    })
}

/**
 * 角色列表（含各自权限点）
 */
export function roleList() {
    return request({
        url: '/track/admin/role-list',
        method: 'get'
    })
}

/**
 * 保存角色的页面权限点
 * @param data {role_id, perm_codes: []}
 */
export function saveRolePermission(data) {
    return request({
        url: '/track/admin/role-permission',
        method: 'put',
        data
    })
}

/**
 * 保存用户级页面权限增量
 * @param data {user_id, grants: [], denies: []}
 */
export function saveUserPermission(data) {
    return request({
        url: '/track/admin/sys-user-permission',
        method: 'put',
        data
    })
}
