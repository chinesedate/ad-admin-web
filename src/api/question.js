import request from '@/utils/request'

export function askQuestion(data) {
    return request({
        url: '/api/platform/question/ask',
        method: 'post',
        data
    })
}

export function questionList(data) {
    return request({
        url: '/api/platform/question/list',
        method: 'post',
        data
    })
}

export function fetchQuestion(questionId) {
    return request({
        url: `/api/platform/question/${questionId}`,
        method: 'get'
    })
}
