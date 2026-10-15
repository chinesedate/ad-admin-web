<template>
  <div class="user-permission-wrapper">
    <el-tabs v-model="activeTab" class="perm-tabs">
      <!-- ==================== 用户权限 ==================== -->
      <el-tab-pane label="用户权限" name="user">
        <div class="user-permission-content">
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
                  <span
                    v-if="!codeScopes(scope.row).length && !advertiserScopes(scope.row).length"
                    class="perm-empty">
                    未配置（看不到任何数据）
                  </span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110" align="center">
              <template #default="scope">
                <el-button
                  v-permission="'user:edit'"
                  type="primary"
                  size="mini"
                  @click="openEditDialog(scope.row)">编辑</el-button>
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
            style="width: 100%">
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
            style="width: 100%">
            <el-option
              v-for="opt in advertiserOptions"
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
            运营角色不选任何范围时默认可见「全部数据」；选了范围则只看所选渠道/广告主的数据。
          </span>
        </el-form-item>
        <el-form-item v-else-if="needDataScope">
          <span class="perm-hint">
            渠道与广告主范围是「并集」；都不选时该用户看不到任何广告数据。
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
  </div>
</template>

<script>
  import {
    dataScopeOptions,
    permissionList,
    roleList,
    saveRolePermission,
    saveUserDataScope,
    saveUserPermission,
    saveUserRole,
    sysUserList
  } from '@/api/rbac'

  // 超级管理员：固定全部数据 + 全部页面，忽略所有配置
  const SUPER_ROLES = ['super_admin']
  // 运营：不配范围时默认全部数据，配了范围则按范围收窄
  const DEFAULT_ALL_ROLES = ['operator']

  // 与后端 SCOPE_CHANNEL_CODE / SCOPE_ADVERTISER_CODE 对应
  const SCOPE_CHANNEL_CODE = 'channel_code'
  const SCOPE_ADVERTISER_CODE = 'advertiser_code'

  // 权限点按 perm_code 冒号前缀分组（ad_data:list / ad_data:export 同属「广告数据」）。
  // 少数不带前缀或前缀与页面不一致的按钮，在这里显式归组。
  const PERM_GROUP_ALIAS = {
    'media_debug': 'media_link'
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
        tableData: [],
        channelOptions: [],
        advertiserOptions: [],
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
          grants: [],
          denies: []
        }
      }
    },
    computed: {
      canManageRole() {
        return this.$store.getters.hasPerm('role:list')
      },
      // 角色下拉：直接用后端角色表
      roleOptions() {
        return this.roles.map(role => ({value: role.role_code, label: role.role_name}))
      },
      // 权限树：分组节点 + 叶子（页面/按钮）节点
      permTree() {
        const groups = {}
        const order = []
        this.permList.forEach(perm => {
          const key = permGroupKey(perm.perm_code)
          if (!groups[key]) {
            groups[key] = {perm_code: key, label: '', children: []}
            order.push(key)
          }
          groups[key].children.push({
            perm_code: perm.perm_code,
            label: perm.perm_name,
            perm_type: perm.perm_type
          })
        })
        // 组名优先取组内「页面」权限点的名称，去掉「查看」后缀更贴近菜单标题
        order.forEach(key => {
          const group = groups[key]
          const page = this.permList.find(
            perm => permGroupKey(perm.perm_code) === key && perm.perm_type === 'menu')
          group.label = page ? page.perm_name.replace(/查看$/, '') : key
        })
        return order.map(key => groups[key])
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
          // 角色在这个菜单下有任何权限点（页面本身或任一按钮）就展示整组
          .filter(group => group.children.some(child => baseline.has(child.perm_code)))
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
      // 分组节点下真正的「页面」权限点（perm_type = menu）
      pagePermOf(group) {
        return group.children.find(child => child.perm_type === 'menu')
      },
      /**
       * 勾选联动：分组节点（页面）级联其下所有按钮，叶子节点交给 syncPageChecked 补页面。
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
       * 保证不变式：页内有按钮被选中时，该页面也处于选中态。
       * 注意页面是分组下 perm_type=menu 的那个权限点，分组节点本身只是 UI 容器（伪 perm_code），
       * 两者都要点亮 —— 前者是真正保存的权限，后者是给用户看的勾选态。
       * 勾选、回显两条路径都要走，否则从库里读出来的数据会渲染出「按钮选着、页面没选」。
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
          const page = this.pagePermOf(group)
          if (page && checked.indexOf(page.perm_code) === -1) {
            tree.setChecked(page.perm_code, true, false)
          }
          if (checked.indexOf(group.perm_code) === -1) {
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
      openEditDialog(row) {
        const scopes = row.data_scopes || {}
        const overrides = row.perm_overrides || {}
        this.form = {
          user_id: row.id,
          username: row.username,
          role_codes: (row.role_codes || []).slice(),
          channel_codes: (scopes[SCOPE_CHANNEL_CODE] || []).slice(),
          advertiser_codes: (scopes[SCOPE_ADVERTISER_CODE] || []).slice(),
          grants: (overrides.grants || []).slice(),
          denies: (overrides.denies || []).slice()
        }
        this.dialogVisible = true
        this.$nextTick(() => this.applyUserChecked(this.form.denies))
      },
      closeDialog() {
        this.form = {
          user_id: null,
          username: '',
          role_codes: [],
          channel_codes: [],
          advertiser_codes: [],
          grants: [],
          denies: []
        }
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
            [SCOPE_ADVERTISER_CODE]: this.form.advertiser_codes
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
