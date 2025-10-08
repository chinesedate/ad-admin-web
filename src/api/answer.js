import request from '@/utils/request'

export function addAnswer(data) {
    return request({
        url: '/api/platform/answer',
        method: 'post',
        data
    })
}

export function answerList(data) {
    return request({
        url: '/api/platform/answer/list',
        method: 'post',
        data
    })
}

export function loadMoreAnswerResponse(answerId, data) {
    return request({
        url: `/api/platform/answer/${answerId}/more`,
        method: 'get',
        params: data
    })
}
