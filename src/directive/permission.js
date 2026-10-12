import store from '@/store'

/**
 * 按钮级权限指令。
 *
 * 用法：
 *   <el-button v-permission="'ad_data:export'">导出</el-button>
 *   <el-button v-permission="['adv_link:edit', 'media_link:edit']">编辑</el-button>
 *
 * 传数组时任一权限点满足即可；无权限时把元素直接从 DOM 中移除。
 */
function hasPermission(value) {
  if (!value) {
    return true
  }
  const codes = Array.isArray(value) ? value : [value]
  return codes.some(code => store.getters.hasPerm(code))
}

export default {
  inserted(el, binding) {
    if (!hasPermission(binding.value) && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
}
