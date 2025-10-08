import request from '@/utils/request'

export function addComment(data) {
    return request({
        url: '/api/platform/comment',
        method: 'post',
        data
    });
}

export function fetchCommentList(data) {
    return request({
        url: '/api/platform/comment/list',
        method: 'post',
        data
    });
}
