import request from '@/utils/request'

/**
 * 获取工具信息列表
 * @param data 查询条件
 */
export function listTool(data) {
  return request({
    url: '/api/adm/edit/tool/list',
    method: 'post',
    data
  })
}

/**
 * 获取工具信息
 * @param id 待审核工具id
 */
export function fetchTool(id) {
  return request({
    url: `/api/adm/edit/tool/${id}`,
    method: 'get'
  })
}

/**
 * 查询搜索建议
 * @param searchContent 搜索内容
 */
export function querySearchSuggestion(searchContent) {
  return request({
    url: `/api/adm/edit//tool/search/suggestion`,
    method: 'get',
    params:{searchContent}
  })
}