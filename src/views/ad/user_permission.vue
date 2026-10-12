<template>
  <div class="user-permission-wrapper">
    <div class="user-permission-content">
      <div class="user-permission-header">用户权限</div>
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

    <el-dialog
      title="编辑用户权限"
      :visible.sync="dialogVisible"
      width="640px"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="用户名">
          <span>{{ form.username }}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role_codes" multiple placeholder="请选择角色" style="width: 100%">
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
            该用户拥有超级管理员角色，固定为「全部数据」，数据范围配置不生效。
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
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {sysUserList, dataScopeOptions, saveUserRole, saveUserDataScope} from '@/api/rbac'

  // 角色是固定的四类，与后端 sys_role 种子数据一致
  const ROLE_OPTIONS = [
    {value: 'super_admin', label: '超级管理员'},
    {value: 'operator', label: '运营/配置'},
    {value: 'channel', label: '渠道/媒体方'},
    {value: 'advertiser', label: '广告主/客户'}
  ]

  // 超级管理员：固定全部数据，忽略数据范围配置
  const SUPER_ROLES = ['super_admin']
  // 运营：不配范围时默认全部数据，配了范围则按范围收窄
  const DEFAULT_ALL_ROLES = ['operator']

  // 与后端 SCOPE_CHANNEL_CODE / SCOPE_ADVERTISER_CODE 对应
  const SCOPE_CHANNEL_CODE = 'channel_code'
  const SCOPE_ADVERTISER_CODE = 'advertiser_code'

  export default {
    name: 'UserPermission',
    data() {
      return {
        loading: false,
        saving: false,
        tableData: [],
        roleOptions: ROLE_OPTIONS,
        channelOptions: [],
        advertiserOptions: [],
        dialogVisible: false,
        form: {
          user_id: null,
          username: '',
          role_codes: [],
          channel_codes: [],
          advertiser_codes: []
        }
      }
    },
    computed: {
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
        const opt = ROLE_OPTIONS.find(item => item.value === code)
        return opt ? opt.label : code
      },
      codeScopes(row) {
        return (row.data_scopes && row.data_scopes[SCOPE_CHANNEL_CODE]) || []
      },
      advertiserScopes(row) {
        return (row.data_scopes && row.data_scopes[SCOPE_ADVERTISER_CODE]) || []
      },
      async loadData() {
        this.loading = true
        try {
          const [userRes, optionRes] = await Promise.all([sysUserList(), dataScopeOptions()])
          this.tableData = (userRes.data.data && userRes.data.data.list) || []
          const options = (optionRes.data.data) || {}
          this.channelOptions = options.channel_options || []
          this.advertiserOptions = options.advertiser_options || []
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        } finally {
          this.loading = false
        }
      },
      openEditDialog(row) {
        const scopes = row.data_scopes || {}
        this.form = {
          user_id: row.id,
          username: row.username,
          role_codes: (row.role_codes || []).slice(),
          channel_codes: (scopes[SCOPE_CHANNEL_CODE] || []).slice(),
          advertiser_codes: (scopes[SCOPE_ADVERTISER_CODE] || []).slice()
        }
        this.dialogVisible = true
      },
      closeDialog() {
        this.form = {
          user_id: null,
          username: '',
          role_codes: [],
          channel_codes: [],
          advertiser_codes: []
        }
      },
      async handleSave() {
        this.saving = true
        try {
          await saveUserRole({user_id: this.form.user_id, role_codes: this.form.role_codes})
          // 超级管理员忽略范围，清空避免日后降级时残留
          const scopes = this.isUnrestricted ? {} : {
            [SCOPE_CHANNEL_CODE]: this.form.channel_codes,
            [SCOPE_ADVERTISER_CODE]: this.form.advertiser_codes
          }
          await saveUserDataScope({user_id: this.form.user_id, scopes})
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.loadData()
        } catch (e) {
          // 错误提示已由 axios 拦截器统一处理
        } finally {
          this.saving = false
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

  .user-permission-header {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
  }

  .perm-tag {
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .perm-empty {
    color: #909399;
    font-size: 12px;
  }

  .perm-hint {
    color: #e6a23c;
    font-size: 12px;
    line-height: 1.5;
  }
</style>
