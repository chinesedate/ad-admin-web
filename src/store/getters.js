const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permissionsLoaded: state => state.user.permissionsLoaded,
  /**
   * 判断是否拥有某个权限点；'*' 表示全权限（超级管理员）
   */
  hasPerm: state => code => {
    if (!code) {
      return true
    }
    const permissions = state.user.permissions || []
    return permissions.indexOf('*') > -1 || permissions.indexOf(code) > -1
  },
  chooseLabel: state => state.label.chooseLabel,
  apiPageState: state => state.page.apiPageState
}
export default getters
