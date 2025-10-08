import request from '@/utils/request'

export function fetchBookList(data) {
    return request({
        url: '/api/platform/book/list',
        method: 'post',
        data
    });
}

export function fetchBookCategory(query) {
    return request({
        url: '/api/platform/read/category',
        method: 'get',
        params: query
    });
}

export function fetchReadImage(query) {
    return request({
        url: '/api/platform/read/image',
        method: 'get',
        params: query
    });
}

export function fetchRecommendBook(query) {
    return request({
        url: '/api/platform/book/recommend',
        method: 'get',
        params: query
    });
}

export function fetchClassicBook(query) {
    return request({
        url: '/api/platform/read/classic',
        method: 'get',
        params: query
    });
}

export function fetchNewBook(query) {
    return request({
        url: '/api/platform/new',
        method: 'get',
        params: query
    });
}

export function fetchLikeBook(query) {
    return request({
        url: '/api/platform/like',
        method: 'get',
        params: query
    });
}

export function saveBookImage(data) {
    return request({
        url: '/api/platform/book/image',
        method: 'post',
        data,
        headers: {"content-type": "multipart/form-data"}
    });
}

export function removeBookImage(id) {
    return request({
        url: `/api/platform/book/image/${id}`,
        method: 'delete'
    });
}

export function fetchBook(id) {
    return request({
        url: `/api/platform/book/${id}`,
        method: 'get'
    });
}

export function saveBook(data) {
    return request({
        url: '/api/platform/book',
        method: 'post',
        data
    });
}


/**
 * 查询个人书本列表
 * @param data 查询条件
 */
export function fetchPersonalBookList(data) {
    return request({
        url: '/api/platform/personal/book/list',
        method: 'post',
        data
    });
}

/**
 * 删除书本
 * @param bookId 书本id
 */
export function removePersonalBook(bookId) {
    return request({
        url: `/api/platform/personal/book/${bookId}`,
        method: 'delete'
    });
}
