import request from '@/utils/request'

export function login({username, password}) {
    // 登录采用form表单进行提交
    const form = new FormData();
    // 添加用户名
    form.append("username", username);
    // 添加密码
    form.append("password", password);
    // 添加验证码
    // form.append("verifyCode", verifyCode);
    return request({
        url: '/api/adm/login',
        method: 'post',
        data: form,
        headers: {"content-type": "multipart/form-data"}
    });
}

export function getInfo(token) {
    return request({
        url: '/vue-element-admin/user/info',
        method: 'get',
        params: {token}
    })
}

export function logout() {
    return request({
        url: '/api/adm/logout',
        method: 'post'
    })
}

export function addUser(data) {

    // 登录采用form表单进行提交
    const form = new FormData();
    // 添加用户名
    form.append("username", data.username);
    // 添加邮箱
    form.append("email", data.email);
    // 添加密码
    form.append("password", data.password);
    return request({
        url: '/api/auth/user',
        method: 'post',
        data: form,
        headers: {"content-type": "multipart/form-data"}
    })
}

/**
 * 邮件发送验证码
 * @param data 用户信息
 */
export function sendEmailVerifyCode(data) {
    return request({
        url: '/api/adm/verify-code',
        method: 'post',
        data
    })
}
