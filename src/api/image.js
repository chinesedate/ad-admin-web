import request from '@/utils/request'

export function imageTest(query) {
    return request({
        url: '/api/path',
        method: 'get',
        params: query
    })
}
