import request from '@/utils/request'

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
        url: '/api/platform/read/recommend',
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
        url: '/api/platform/read/new',
        method: 'get',
        params: query
    });
}

export function fetchLikeBook(query) {
    return request({
        url: '/api/platform/read/like',
        method: 'get',
        params: query
    });
}

export function uploadBookImage(data) {
    return request({
        url: '/api/platform/read/book/image',
        method: 'post',
        data,
        headers: {"content-type": "multipart/form-data"}
    });
}

export function removeBookImage(id) {
    return request({
       url: `/api/platform/read/book/image/${id}`,
        method:'delete'
    });
}

export function fetchBook(id) {
    return request({
        url: `/api/platform/read/book/${id}`,
        method: 'get'
    });
}

export function saveBook(data){
    return request({
        url:'/api/platform/read/book',
        method:'post',
        data
    });
}
