<template>
  <div class="user-permission-wrapper">
    <el-tabs v-model="activeTab" class="perm-tabs">
      <!-- ==================== 用户权限 ==================== -->
      <el-tab-pane label="用户权限" name="user">
        <div class="user-permission-content">
          <div class="user-toolbar">
            <el-button
              v-permission="'user:edit'"
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="openCreateDialog">添加用户</el-button>
          </div>
          <el-table
            v-loading="loading"
            :data="tableData"
            row-key="id"
            stripe
            style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" align="center"/>
            <el-table-column prop="username" label="用户名" min-width="140" show-overflow-tooltip/>
            <el-table-column label="状态" width="90" align="center">
              <template #default="scope">
                <el-tag
                  :type="Number(scope.row.state) === 0 ? 'success' : 'info'"
                  size="small"
                  effect="light">
                  {{ Number(scope.row.state) === 0 ? '可用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="角色" min-width="180">
              <template #default="scope">
                <el-tag
                  v-for="code in scope.row.role_codes"
                  :key="code"
                  class="perm-tag"
                  size="small"
                  effect="light">
                  {{ roleLabel(code) }}
                </el-tag>
                <span v-if="!(scope.row.role_codes || []).length" class="perm-empty">未分配</span>
              </template>
            </el-table-column>
            <el-table-column label="页面权限" min-width="150">
              <template #default="scope">
                <span v-if="overrideText(scope.row) === ''" class="perm-empty">继承角色</span>
                <span v-else class="perm-override">{{ overrideText(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数据范围" min-width="280">
              <template #default="scope">
                <el-tag v-if="scope.row.unrestricted" class="perm-tag" type="warning" size="small" effect="light">
                  全部数据
                </el-tag>
                <template v-else>
                  <el-tag
                    v-for="code in codeScopes(scope.row)"
                    :key="'c-' + code"
                    class="perm-tag"
                    type="success"
                    size="small"
                    effect="light">
                    {{ code }}
                  </el-tag>
                  <el-tag
                    v-for="code in advertiserScopes(scope.row)"
                    :key="'a-' + code"
                    class="perm-tag"
                    size="small"
                    effect="light">
                    {{ code }}
                  </el-tag>
                  <el-tag
                    v-for="code in customerScopes(scope.row)"
                    :key="'cu-' + code"
                    class="perm-tag"
                    type="info"
                    size="small"
                    effect="light">
                    客户 {{ code }}
                  </el-tag>
                  <el-tag
                    v-for="code in appScopes(scope.row)"
                    :key="'ap-' + code"
                    class="perm-tag"
                    type="info"
                    size="small"
                    effect="light">
                    应用 {{ code }}
                  </el-tag>
                  <span
                    v-if="!codeScopes(scope.row).length && !advertiserScopes(scope.row).length
                      && !customerScopes(scope.row).length && !appScopes(scope.row).length"
                    class="perm-empty">
                    未配置（看不到任何数据）
                  </span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
              <template #default="scope">
                <el-button
                  v-permission="'user:edit'"
                  type="primary"
                  size="mini"
                  @click="openEditDialog(scope.row)">编辑</el-button>
                <el-button
                  v-permission="'user:edit'"
                  type="primary"
                  size="mini"
                  @click="openPasswordDialog(scope.row)">修改密码</el-button>
                <el-button
                  v-permission="'user:edit'"
                  type="danger"
                  size="mini"
                  :disabled="scope.row.username === currentUsername"
                  @click="handleDeleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- ==================== 页面权限 ==================== -->
      <el-tab-pane v-if="canManageRole" label="页面权限" name="role">
        <div class="user-permission-content role-perm-content">
          <div class="role-list">
            <div
              v-for="role in roles"
              :key="role.id"
              :class="['role-item', {active: currentRole && currentRole.id === role.id}]"
              @click="selectRole(role)">
              <span class="role-name">{{ role.role_name }}</span>
              <el-tag v-if="role.pinned" size="mini" type="warning" effect="light">固定</el-tag>
            </div>
          </div>
          <div class="role-perm-detail">
            <div class="role-perm-header">
              <span class="role-perm-title">{{ currentRole ? currentRole.role_name : '请选择角色' }}</span>
              <el-button
                v-permission="'role:edit'"
                type="primary"
                size="mini"
                :disabled="!currentRole || currentRole.pinned"
                :loading="savingRole"
                @click="saveRolePerms">保存</el-button>
            </div>
            <div v-if="!currentRole" class="perm-empty">请从左侧选择一个角色</div>
            <template v-else>
              <div v-if="currentRole.pinned" class="perm-hint">
                超级管理员固定拥有全部页面权限，不可修改。
              </div>
              <div v-else class="perm-hint">
                勾选「页面」即开放左侧菜单与对应路由；「页内按钮」控制编辑、导出等具体操作。
              </div>
              <el-tree
                ref="roleTree"
                class="perm-tree"
                :class="{'perm-tree-disabled': currentRole.pinned}"
                :data="permTree"
                :props="treeProps"
                node-key="perm_code"
                show-checkbox
                check-strictly
                default-expand-all
                @check="(data, info) => onTreeCheck('roleTree', data, info)"/>
            </template>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- ==================== 编辑用户权限 ==================== -->
    <el-dialog
      title="编辑用户权限"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="用户名">
          <span>{{ form.username }}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="form.role_codes"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
            @change="onRoleChange">
            <el-option
              v-for="opt in roleOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="needDataScope" label="渠道范围">
          <el-select
            v-model="form.channel_codes"
            multiple
            filterable
            :disabled="isUnrestricted"
            placeholder="选择该用户可见的渠道（媒体侧）"
            style="width: 100%"
            @change="onScopeChange">
            <el-option
              v-for="opt in channelOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="needDataScope" label="广告主范围">
          <el-select
            v-model="form.advertiser_codes"
            multiple
            filterable
            :disabled="isUnrestricted"
            placeholder="选择该用户可见的广告主"
            style="width: 100%"
            @change="onScopeChange">
            <el-option
              v-for="opt in advertiserOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="needDataScope" label="客户ID">
          <el-select
            v-model="form.customer_ids"
            multiple
            filterable
            :disabled="isUnrestricted || !hasScopeSource"
            :placeholder="hasScopeSource ? '选择客户ID（候选随已选渠道/广告主联动）' : '请先选择渠道或广告主范围'"
            style="width: 100%">
            <el-option
              v-for="opt in customerOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="needDataScope" label="应用">
          <el-select
            v-model="form.app_ids"
            multiple
            filterable
            :disabled="isUnrestricted || !hasScopeSource"
            :placeholder="hasScopeSource ? '选择应用（候选随已选渠道/广告主联动）' : '请先选择渠道或广告主范围'"
            style="width: 100%">
            <el-option
              v-for="opt in appOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isUnrestricted">
          <span class="perm-hint">
            该用户拥有超级管理员角色，固定为「全部数据」与「全部页面」。
          </span>
        </el-form-item>
        <el-form-item v-else-if="defaultsToAll">
          <span class="perm-hint">
            运营角色不选任何范围时默认可见「全部数据」；选了范围则按所选范围收窄。
          </span>
        </el-form-item>
        <el-form-item v-else-if="needDataScope">
          <span class="perm-hint">
            同一维度内多选取「并集」，不同维度之间取「交集」（如渠道 A + 客户 X = 渠道 A 下客户 X 的数据）；
            一项都不选时该用户看不到任何广告数据。
          </span>
        </el-form-item>
        <el-form-item v-if="needDataScope" label="页面权限">
          <div class="perm-hint perm-tree-hint">
            只展示所选角色已授予的菜单，默认全部继承；取消勾选 = 对该用户单独收回，勾选角色未包含的按钮 = 额外授予。
          </div>
          <el-tree
            v-if="userPermTree.length"
            ref="userTree"
            class="perm-tree"
            :data="userPermTree"
            :props="treeProps"
            node-key="perm_code"
            show-checkbox
            check-strictly
            default-expand-all
            @check="(data, info) => onTreeCheck('userTree', data, info)"/>
          <div v-else class="perm-empty">所选角色未授予任何页面权限。</div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>

    <!-- ==================== 添加用户 ==================== -->
    <el-dialog
      title="添加用户"
      :visible.sync="createVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="resetCreateForm">
      <el-form label-width="90px">
        <el-form-item label="用户名" required>
          <el-input v-model="createForm.username" placeholder="登录用户名" maxlength="64"/>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="createForm.password" type="password" show-password placeholder="8~16 位"/>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="createForm.role_codes" multiple placeholder="可稍后在编辑里分配" style="width: 100%">
            <el-option
              v-for="opt in roleOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="createForm.state">
            <el-radio :label="0">可用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="handleCreateUser">确定</el-button>
      </div>
    </el-dialog>

    <!-- ==================== 修改密码 ==================== -->
    <el-dialog
      title="修改密码"
      :visible.sync="pwdVisible"
      width="480px"
      :close-on-click-modal="false"
      @close="resetPwdForm">
      <el-form label-width="90px">
        <el-form-item label="用户名">
          <span>{{ pwdForm.username }}</span>
        </el-form-item>
        <el-form-item label="新密码" required>
          <el-input v-model="pwdForm.password" type="password" show-password placeholder="8~16 位"/>
        </el-form-item>
        <el-form-item label="确认密码" required>
          <el-input v-model="pwdForm.confirm" type="password" show-password placeholder="再次输入新密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingPwd" @click="handleSavePassword">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    createSysUser,
    dataScopeOptions,
    deleteSysUser,
    permissionList,
    roleList,
    saveRolePermission,
    saveUserDataScope,
    saveUserPassword,
    saveUserPermission,
    saveUserRole,
    sysUserList
  } from '@/api/rbac'
  import menus from '@/config/menus'
  import md5 from 'js-md5'

  // 超级管理员：固定全部数据 + 全部页面，忽略所有配置
  const SUPER_ROLES = ['super_admin']
  // 运营：不配范围时默认全部数据，配了范围则按范围收窄
  const DEFAULT_ALL_ROLES = ['operator']

  // 与后端 SCOPE_CHANNEL_CODE / SCOPE_ADVERTISER_CODE / SCOPE_CUSTOMER_ID / SCOPE_APP_ID 对应
  const SCOPE_CHANNEL_CODE = 'channel_code'
  const SCOPE_ADVERTISER_CODE = 'advertiser_code'
  const SCOPE_CUSTOMER_ID = 'customer_id'
  const SCOPE_APP_ID = 'app_id'

  // 权限点按 perm_code 冒号前缀分组（ad_data:list / ad_data:export 同属「广告数据」）。
  // 少数不带前缀或前缀与页面不一致的按钮，在这里显式归组。
  const PERM_GROUP_ALIAS = {
    'media_debug': 'media_link',
    // 链接参数字典是「预算媒体管理」页里的按钮权限，不单独占一个页面
    'link_param:list': 'adv_media',
    'link_param:edit': 'adv_media'
  }

  // 菜单顺序：页面权限树按侧边栏菜单的先后排列。
  // 「链接」与「预算链接」共用 adv_link:list，权限树里以「预算链接」的位置为准，
  // 所以「链接」这个菜单不参与排序。
  const MENU_ORDER_IGNORE = {'ad-link': true}
  const MENU_ORDER = {}
  menus.forEach((menu, index) => {
    if (MENU_ORDER_IGNORE[menu.index]) {
      return
    }
    if (menu.permission && MENU_ORDER[menu.permission] === undefined) {
      MENU_ORDER[menu.permission] = index
    }
  })

  function permMenuOrder(permCode) {
    return MENU_ORDER[permCode] === undefined ? Number.MAX_SAFE_INTEGER : MENU_ORDER[permCode]
  }

  function permGroupKey(permCode) {
    if (PERM_GROUP_ALIAS[permCode]) {
      return PERM_GROUP_ALIAS[permCode]
    }
    const idx = permCode.indexOf(':')
    return idx > -1 ? permCode.slice(0, idx) : permCode
  }

  export default {
    name: 'UserPermission',
    data() {
      return {
        activeTab: 'user',
        loading: false,
        saving: false,
        savingRole: false,
        creating: false,
        createVisible: false,
        createForm: {
          username: '',
          password: '',
          role_codes: [],
          state: 0
        },
        pwdVisible: false,
        savingPwd: false,
        pwdForm: {
          user_id: null,
          username: '',
          password: '',
          confirm: ''
        },
        tableData: [],
        channelOptions: [],
        advertiserOptions: [],
        // 客户 / 应用候选：随已选渠道、广告主联动
        customerOptions: [],
        appOptions: [],
        // 权限点字典与角色基线
        permList: [],
        roles: [],
        currentRole: null,
        treeProps: {label: 'label', children: 'children'},
        dialogVisible: false,
        form: {
          user_id: null,
          username: '',
          role_codes: [],
          channel_codes: [],
          advertiser_codes: [],
          customer_ids: [],
          app_ids: [],
          grants: [],
          denies: []
        }
      }
    },
    computed: {
      canManageRole() {
        return this.$store.getters.hasPerm('role:list')
      },
      // 当前登录用户名，用于禁止删除自己
      currentUsername() {
        return this.$store.getters.name
      },
      // 角色下拉：直接用后端角色表
      roleOptions() {
        return this.roles.map(role => ({value: role.role_code, label: role.role_name}))
      },
      /**
       * 权限树：分组节点就是「菜单」本身（挂的 perm_code 是真实的 menu 权限点），
       * 子节点只列页内按钮。菜单权限点不再单独渲染成一行，避免和分组重复、还能被单独取消。
       */
      permTree() {
        const buckets = {}
        const order = []
        this.permList.forEach(perm => {
          const key = permGroupKey(perm.perm_code)
          if (!buckets[key]) {
            buckets[key] = []
            order.push(key)
          }
          buckets[key].push(perm)
        })
        return order.map(key => {
          const members = buckets[key]
          const page = members.find(perm => perm.perm_type === 'menu')
          // 兜底：分组里没有 menu 权限点时退化成纯容器，不参与保存
          const groupCode = page ? page.perm_code : '__group__' + key
          return {
            perm_code: groupCode,
            label: page ? page.perm_name : key,
            children: members
              .filter(perm => perm !== page)
              .map(perm => ({
                perm_code: perm.perm_code,
                label: perm.perm_name,
                perm_type: perm.perm_type
              }))
          }
        }).sort((a, b) => permMenuOrder(a.perm_code) - permMenuOrder(b.perm_code))
      },
      // 全部合法权限点编码，用于过滤已下线的历史数据
      allPermCodes() {
        return this.permList.map(perm => perm.perm_code)
      },
      // 角色编码 → 权限点列表
      rolePermMap() {
        const map = {}
        this.roles.forEach(role => {
          map[role.role_code] = role.perm_codes || []
        })
        return map
      },
      // 当前所选角色带来的权限基线（只保留仍存在的权限点）
      roleBaselineSet() {
        const valid = this.allPermCodes
        const baseline = new Set()
        this.form.role_codes.forEach(code => {
          (this.rolePermMap[code] || []).forEach(perm => {
            if (valid.indexOf(perm) > -1) {
              baseline.add(perm)
            }
          })
        })
        return baseline
      },
      /**
       * 用户弹窗专用的权限树：以「菜单」为边界 —— 角色没有的菜单整组不展示，
       * 角色有的菜单则连同其下所有按钮一起展示，不做按钮级裁剪
       * （这样管理员还能在角色基础上，单独给某个用户授予页内的某个按钮）。
       */
      userPermTree() {
        const baseline = this.roleBaselineSet
        return this.permTree
          // 角色授予了这个菜单（或该菜单下任一按钮）就展示整组
          .filter(group => baseline.has(group.perm_code)
            || group.children.some(child => baseline.has(child.perm_code)))
      },
      // 超级管理员固定全部数据，范围框禁用
      isUnrestricted() {
        return this.form.role_codes.some(code => SUPER_ROLES.indexOf(code) > -1)
      },
      // 除超级管理员外，其他角色都可以配数据范围
      needDataScope() {
        return this.form.role_codes.some(code => SUPER_ROLES.indexOf(code) === -1)
      },
      // 含运营角色：不配范围时默认全部数据
      defaultsToAll() {
        return this.form.role_codes.some(code => DEFAULT_ALL_ROLES.indexOf(code) > -1)
      },
      // 客户 / 应用候选依赖渠道或广告主范围
      hasScopeSource() {
        return (this.form.channel_codes || []).length > 0
          || (this.form.advertiser_codes || []).length > 0
      }
    },
    methods: {
      roleLabel(code) {
        const opt = this.roleOptions.find(item => item.value === code)
        return opt ? opt.label : code
      },
      codeScopes(row) {
        return (row.data_scopes && row.data_scopes[SCOPE_CHANNEL_CODE]) || []
      },
      advertiserScopes(row) {
        return (row.data_scopes && row.data_scopes[SCOPE_ADVERTISER_CODE]) || []
      },
      customerScopes(row) {
        return (row.data_scopes && row.data_scopes[SCOPE_CUSTOMER_ID]) || []
      },
      appScopes(row) {
        return (row.data_scopes && row.data_scopes[SCOPE_APP_ID]) || []
      },
      /**
       * 重新拉取客户 / 应用候选（随已选渠道、广告主联动）。
       * prune=true 时丢弃已不在候选中的选中值，避免渠道换了以后残留无效范围。
       */
      async reloadScopeOptions(prune) {
        try {
          const res = await dataScopeOptions({
            channel_codes: (this.form.channel_codes || []).join(','),
            advertiser_codes: (this.form.advertiser_codes || []).join(',')
          })
          const options = (res.data && res.data.data) || {}
          this.customerOptions = options.customer_options || []
          this.appOptions = options.app_options || []
          if (prune) {
            const customerSet = new Set(this.customerOptions.map(item => item.value))
            const appSet = new Set(this.appOptions.map(item => item.value))
            this.form.customer_ids = (this.form.customer_ids || []).filter(v => customerSet.has(v))
            this.form.app_ids = (this.form.app_ids || []).filter(v => appSet.has(v))
          }
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        }
      },
      onScopeChange() {
        this.reloadScopeOptions(true)
      },
      // 用户在角色基线上的调整摘要
      overrideText(row) {
        const overrides = row.perm_overrides || {}
        const grants = (overrides.grants || []).length
        const denies = (overrides.denies || []).length
        if (!grants && !denies) {
          return ''
        }
        const parts = []
        if (grants) {
          parts.push('额外授予 ' + grants + ' 项')
        }
        if (denies) {
          parts.push('单独收回 ' + denies + ' 项')
        }
        return parts.join('，')
      },
      /**
       * 勾选联动：分组节点就是菜单，勾/取消会级联其下所有按钮；
       * 叶子（按钮）勾上时，所属菜单也要勾上。
       * check-strictly 下父子互不影响，所以这里手工补上联动。
       */
      onTreeCheck(refName, data, info) {
        const tree = this.$refs[refName]
        if (!tree) {
          return
        }
        if (data.children && data.children.length) {
          const checked = info.checkedKeys.indexOf(data.perm_code) > -1
          data.children.forEach(child => tree.setChecked(child.perm_code, checked, false))
        }
        this.syncPageChecked(refName)
      },
      /**
       * 保证不变式：页内有按钮被选中时，该菜单也必须选中（按钮脱离菜单没有意义）。
       * 勾选、回显两条路径都要走，否则从库里读出来的数据会渲染出「按钮选着、菜单没选」。
       */
      syncPageChecked(refName) {
        const tree = this.$refs[refName]
        if (!tree) {
          return
        }
        // 用树自己的数据：用户树只含角色已授予的节点，角色树是全集
        const treeData = tree.data || []
        const checked = tree.getCheckedKeys()
        treeData.forEach(group => {
          const anyChildChecked = group.children.some(
            child => checked.indexOf(child.perm_code) > -1)
          if (!anyChildChecked) {
            return
          }
          // 纯容器分组（无 menu 权限点）不用管
          if (this.allPermCodes.indexOf(group.perm_code) > -1
            && checked.indexOf(group.perm_code) === -1) {
            tree.setChecked(group.perm_code, true, false)
          }
        })
      },
      // 设置勾选态并补齐页面节点（过滤掉已下线的权限点）
      setTreeChecked(refName, codes) {
        const tree = this.$refs[refName]
        if (!tree) {
          return
        }
        tree.setCheckedKeys((codes || []).filter(code => this.allPermCodes.indexOf(code) > -1))
        this.syncPageChecked(refName)
      },
      // 勾选态 = 角色基线 + 额外授予 − 单独收回
      applyUserChecked(denies) {
        const checked = new Set(this.roleBaselineSet)
        ;(this.form.grants || []).forEach(code => {
          if (this.allPermCodes.indexOf(code) > -1) {
            checked.add(code)
          }
        })
        ;(denies || []).forEach(code => checked.delete(code))
        this.setTreeChecked('userTree', Array.from(checked))
      },
      // 树的勾选结果里混有分组节点（如 ad_data），只取真实权限点
      checkedPermCodes(refName) {
        const tree = this.$refs[refName]
        if (!tree) {
          return []
        }
        return tree.getCheckedKeys().filter(code => this.allPermCodes.indexOf(code) > -1)
      },
      // 角色变化：基线变了，按新基线 + 已有调整重算勾选
      onRoleChange() {
        this.$nextTick(() => this.applyUserChecked(this.form.denies))
      },
      async loadData() {
        this.loading = true
        try {
          const requests = [sysUserList(), dataScopeOptions()]
          if (this.canManageRole) {
            requests.push(roleList(), permissionList())
          }
          const [userRes, optionRes, roleRes, permRes] = await Promise.all(requests)
          this.tableData = (userRes.data.data && userRes.data.data.list) || []
          const options = (optionRes.data.data) || {}
          this.channelOptions = options.channel_options || []
          this.advertiserOptions = options.advertiser_options || []
          if (roleRes) {
            this.roles = (roleRes.data.data && roleRes.data.data.list) || []
          }
          if (permRes) {
            this.permList = (permRes.data.data && permRes.data.data.list) || []
          }
          // 页面权限页默认选中第一个角色，避免右侧空着
          if (!this.currentRole && this.roles.length) {
            this.$nextTick(() => this.selectRole(this.roles[0]))
          }
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        } finally {
          this.loading = false
        }
      },
      openCreateDialog() {
        this.resetCreateForm()
        this.createVisible = true
      },
      resetCreateForm() {
        this.createForm = {
          username: '',
          password: '',
          role_codes: [],
          state: 0
        }
      },
      async handleCreateUser() {
        const username = (this.createForm.username || '').trim()
        const password = this.createForm.password || ''
        if (!username) {
          this.$message.warning('请输入用户名')
          return
        }
        if (password.length < 8 || password.length > 16) {
          this.$message.warning('密码长度需为 8~16 位')
          return
        }
        this.creating = true
        try {
          await createSysUser({
            username,
            // 与登录流程一致：前端先 md5，后端再 bcrypt
            password: md5(password),
            role_codes: this.createForm.role_codes,
            state: this.createForm.state
          })
          this.$message.success('添加成功')
          this.createVisible = false
          await this.loadData()
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        } finally {
          this.creating = false
        }
      },
      openPasswordDialog(row) {
        this.pwdForm = {
          user_id: row.id,
          username: row.username,
          password: '',
          confirm: ''
        }
        this.pwdVisible = true
      },
      resetPwdForm() {
        this.pwdForm = {
          user_id: null,
          username: '',
          password: '',
          confirm: ''
        }
      },
      async handleSavePassword() {
        const password = this.pwdForm.password || ''
        if (password.length < 8 || password.length > 16) {
          this.$message.warning('密码长度需为 8~16 位')
          return
        }
        if (password !== this.pwdForm.confirm) {
          this.$message.warning('两次输入的密码不一致')
          return
        }
        this.savingPwd = true
        try {
          await saveUserPassword({
            user_id: this.pwdForm.user_id,
            // 与登录流程一致：前端先 md5，后端再 bcrypt
            password: md5(password)
          })
          this.$message.success('密码修改成功')
          this.pwdVisible = false
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        } finally {
          this.savingPwd = false
        }
      },
      async handleDeleteUser(row) {
        if (row.username === this.currentUsername) {
          this.$message.warning('不能删除当前登录用户')
          return
        }
        try {
          await this.$confirm(
            `确定删除用户「${row.username}」吗？其角色、数据范围和页面权限配置会一并删除。`,
            '删除用户',
            {type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消'})
        } catch (e) {
          return
        }
        try {
          await deleteSysUser(row.id)
          this.$message.success('删除成功')
          await this.loadData()
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        }
      },
      openEditDialog(row) {
        const scopes = row.data_scopes || {}
        const overrides = row.perm_overrides || {}
        this.form = {
          user_id: row.id,
          username: row.username,
          role_codes: (row.role_codes || []).slice(),
          channel_codes: (scopes[SCOPE_CHANNEL_CODE] || []).slice(),
          advertiser_codes: (scopes[SCOPE_ADVERTISER_CODE] || []).slice(),
          customer_ids: (scopes[SCOPE_CUSTOMER_ID] || []).slice(),
          app_ids: (scopes[SCOPE_APP_ID] || []).slice(),
          grants: (overrides.grants || []).slice(),
          denies: (overrides.denies || []).slice()
        }
        this.dialogVisible = true
        this.$nextTick(() => this.applyUserChecked(this.form.denies))
        // 按该用户已选的渠道/广告主拉取客户与应用候选（不裁剪已存值）
        this.reloadScopeOptions(false)
      },
      closeDialog() {
        this.form = {
          user_id: null,
          username: '',
          role_codes: [],
          channel_codes: [],
          advertiser_codes: [],
          customer_ids: [],
          app_ids: [],
          grants: [],
          denies: []
        }
        this.customerOptions = []
        this.appOptions = []
      },
      // 保存用户权限：角色 + 数据范围 + 页面权限增量（勾选态反推差异）
      async handleSave() {
        this.saving = true
        try {
          const checked = this.checkedPermCodes('userTree')
          const checkedSet = new Set(checked)
          const baseline = this.roleBaselineSet
          const grants = checked.filter(code => !baseline.has(code))
          const denies = Array.from(baseline).filter(code => !checkedSet.has(code))

          await saveUserRole({user_id: this.form.user_id, role_codes: this.form.role_codes})
          // 超级管理员忽略范围，清空避免日后降级时残留
          const scopes = this.isUnrestricted ? {} : {
            [SCOPE_CHANNEL_CODE]: this.form.channel_codes,
            [SCOPE_ADVERTISER_CODE]: this.form.advertiser_codes,
            [SCOPE_CUSTOMER_ID]: this.form.customer_ids,
            [SCOPE_APP_ID]: this.form.app_ids
          }
          await saveUserDataScope({user_id: this.form.user_id, scopes})
          await saveUserPermission({
            user_id: this.form.user_id,
            grants: this.isUnrestricted ? [] : grants,
            denies: this.isUnrestricted ? [] : denies
          })
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.loadData()
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        } finally {
          this.saving = false
        }
      },
      selectRole(role) {
        this.currentRole = role
        this.$nextTick(() => this.setTreeChecked('roleTree', role.perm_codes))
      },
      async saveRolePerms() {
        if (!this.currentRole) {
          return
        }
        this.savingRole = true
        try {
          const permCodes = this.checkedPermCodes('roleTree')
          await saveRolePermission({role_id: this.currentRole.id, perm_codes: permCodes})
          this.$message.success('保存成功')
          // 自己正好拥有该角色时，本地权限快照也要刷新
          if ((this.$store.getters.roles || []).indexOf(this.currentRole.role_code) > -1) {
            await this.$store.dispatch('user/getInfo')
          }
          const selectedId = this.currentRole.id
          await this.loadData()
          // 重新取一份最新的角色数据，避免停留在过期快照上
          const refreshed = this.roles.find(role => role.id === selectedId)
          if (refreshed) {
            this.selectRole(refreshed)
          }
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        } finally {
          this.savingRole = false
        }
      }
    },
    mounted() {
      this.loadData()
    }
  }
</script>

<style lang="scss" scoped>
  .user-permission-content {
    background-color: #fff;
    border-radius: 4px;
    padding: 16px 20px;
  }

  .user-toolbar {
    margin-bottom: 12px;
  }

  .perm-tag {
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .perm-empty {
    color: #909399;
    font-size: 12px;
  }

  .perm-override {
    color: #e6a23c;
    font-size: 12px;
  }

  .perm-hint {
    color: #e6a23c;
    font-size: 12px;
    line-height: 1.5;
  }

  .perm-tree {
    width: 100%;
  }

  .perm-tree-hint {
    margin-bottom: 4px;
  }

  .role-perm-content {
    display: flex;
    align-items: flex-start;
  }

  .role-list {
    width: 180px;
    flex: none;
    border-right: 1px solid #ebeef5;
    padding-right: 12px;
  }

  .role-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 4px;
    cursor: pointer;
    color: #303133;

    &:hover {
      background-color: #f5f7fa;
    }

    &.active {
      background-color: #ecf5ff;
      color: #409eff;
    }
  }

  .role-name {
    font-size: 14px;
  }

  .role-perm-detail {
    flex: 1;
    min-width: 0;
    padding-left: 16px;
  }

  .role-perm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .role-perm-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .perm-tree-disabled {
    pointer-events: none;
    opacity: 0.6;
  }
</style>
