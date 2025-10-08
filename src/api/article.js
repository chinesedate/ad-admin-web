import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/vue-element-admin/article/list',
        method: 'get',
        params: query
    })
}

export function fetchArticle(id) {
    return request({
        url: '/vue-element-admin/article/detail',
        method: 'get',
        params: { id }
    })
}

export function fetchPv(pv) {
    return request({
        url: '/vue-element-admin/article/pv',
        method: 'get',
        params: { pv }
    })
}

/**
 * 获
 * @param data 工具信息
 */
export function auditArticle(data) {
    return request({
        url: `/api/adm/audit/issue`,
        method: 'put',
        data
    })
}

export function addArticle(data) {
    return request({
        url: '/api/platform/article',
        method: 'post',
        data
    })
}

/**
 * 获取待审核文章列表
 * @param data 查询条件
 */
export function listAuditArticle(data) {
    return request({
        url: '/api/adm/audit/article/list',
        method: 'post',
        data
    })
}
