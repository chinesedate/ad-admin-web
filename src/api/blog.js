import request from '@/utils/request'

export function addBlog(data) {
    return request({
        url: '/api/platform/blog/add',
        method: 'post',
        data
    })
}
