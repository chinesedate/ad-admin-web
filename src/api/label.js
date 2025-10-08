import request from "@/utils/request";

export function fetchLabelLinkList(data) {
    return request({
        url: '/api/platform/label/link',
        method: 'post',
        data
    });
}
