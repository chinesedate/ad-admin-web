const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  chooseLabel: state => state.label.chooseLabel,
  apiPageState: state => state.page.apiPageState
}
export default getters
