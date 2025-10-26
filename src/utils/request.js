import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'
import router from "@/router";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    let res = response.data
    // 判断是否为文件下载请求
    if (response.config.responseType === 'blob') {
      const contentType = response.headers['content-type']
      if (contentType?.includes('application/json')) {
        // 尝试解析为JSON，解析成功表示下载文件接口返回的是json结果，不是文件流
        parseBlobAsJson(response.data).then(jsonResult => {
          // 统一错误处理
          Message({
            showClose: true,
            message: jsonResult.message || 'Error',
            type: 'error',
            offset: 100,
            duration: 3 * 1000
          })
        }).catch(errorData => {
          // 统一错误处理
          Message({
            showClose: true,
            message: errorData.message || 'Error',
            type: 'error',
            offset: 100,
            duration: 3 * 1000
          })
        });
      } else {
        // 处理文件下载
        // 创建 Blob 对象
        const blob = new Blob([response.data], {
          type: contentType
        });

        // 从 Content-Disposition 头中提取文件名
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'download.xlsx';

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename=(.*)/);
          if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1].replace(/"/g, '');
          }
        }

        // 创建下载链接并触发下载
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        return response.data;
      }
    } else {
      // if the custom code is not 20000, it is judged as an error.
      if (res.code !== 0) {
        console.log(res)
        Message({
          showClose: true,
          message: res.message || 'Error',
          type: 'error',
          offset: 100,
          duration: 3 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // to re-login
          MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return response
      }
    }
  },
  error => {
    if (error.response.status === 401) {
      store.dispatch('user/resetToken').then(
        () => {
          // 提示用户登录已过期
          MessageBox.confirm('当前用户登录已过期，可以选择前往登录页', '登录已过期', {
            confirmButtonText: '前往登录页',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(
            () => router.push('/login')
          ).catch(
            // () => router.push('/login')
          )
        }
      )
    } else {
      // console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

/**
 * 将Blob解析为JSON
 * @param {Blob} blob Blob对象
 * @returns {Promise<Object>} 解析后的JSON数据
 */
function parseBlobAsJson(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result);
        resolve(jsonData);
      } catch (error) {
        reject(new Error('解析错误响应失败'));
      }
    };
    reader.onerror = () => reject(new Error('读取Blob数据失败'));
    reader.readAsText(blob);
  });
}

export default service
