import request from '@/utils/request'


export function fetchScreen(content) {
    return request({
        url: `/api/platform/read/screen/${content}`,
        method: 'get'
    });
}
