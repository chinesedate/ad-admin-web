<template>
  <div class="login-page">
    <div class="login-brand">
      <div class="login-brand-inner">
        <div class="brand-logo">
          <i class="el-icon-s-platform"></i>
        </div>
        <h1 class="brand-title">瑞樟广告平台</h1>
        <p class="brand-desc">广告投放监测 · 渠道链接管理 · 预算配置一体化后台</p>
        <ul class="brand-features">
          <li><i class="el-icon-check"></i>广告数据与转化追踪</li>
          <li><i class="el-icon-check"></i>预算媒体与链接解析</li>
          <li><i class="el-icon-check"></i>渠道上下游配置</li>
        </ul>
      </div>
      <div class="brand-decoration brand-decoration-1"></div>
      <div class="brand-decoration brand-decoration-2"></div>
    </div>

    <div class="login-panel">
      <div class="login-panel-inner">
        <div class="login-form-header">
          <h2 class="login-form-title">欢迎登录</h2>
          <p class="login-form-subtitle">请使用管理员账号进入系统</p>
        </div>

        <el-form
          ref="loginRuleForm"
          :model="loginRuleForm"
          :rules="loginRules"
          class="login-form"
          @keyup.enter.native="login('loginRuleForm')"
        >
          <el-form-item prop="account">
            <el-input
              v-model="loginRuleForm.account"
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              clearable
              autocomplete="username"
            />
          </el-form-item>

          <el-form-item prop="pass">
            <el-input
              v-model="loginRuleForm.pass"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
              clearable
              autocomplete="current-password"
            />
          </el-form-item>

          <el-alert
            v-if="loginError"
            class="login-error"
            :title="loginError"
            type="error"
            show-icon
            :closable="false"
          />

          <el-form-item class="login-submit-item">
            <el-button
              type="primary"
              class="login-submit-btn"
              :loading="submitting"
              @click="login('loginRuleForm')"
            >
              {{ submitting ? '登录中…' : '登 录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <footer class="login-footer">
        <span>© {{ currentYear }} 瑞樟广告平台</span>
      </footer>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5';

  export default {
    name: 'login',
    data() {
      return {
        loginRuleForm: {
          account: '',
          pass: ''
        },
        loginRules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 4, max: 16, message: '账号长度 4~16 位', trigger: 'blur'}
          ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 8, max: 16, message: '密码长度 8~16 位', trigger: 'blur'}
          ]
        },
        submitting: false,
        loginError: ''
      };
    },
    computed: {
      currentYear() {
        return new Date().getFullYear();
      }
    },
    methods: {
      login(formName) {
        this.loginError = '';
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.submitting = true;
          this.$store.dispatch('user/login', {
            username: this.loginRuleForm.account,
            password: md5(this.loginRuleForm.pass)
          }).then(() => {
            this.$router.push('/');
          }).catch(() => {
            this.loginError = '账号或密码错误，请检查后重试';
          }).finally(() => {
            this.submitting = false;
          });
          return true;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .login-page {
    display: flex;
    min-height: 100vh;
    background: #f5f7fa;
  }

  .login-brand {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    overflow: hidden;
    background: linear-gradient(145deg, #2b7de9 0%, #409eff 45%, #66b1ff 100%);
    color: #fff;
  }

  .login-brand-inner {
    position: relative;
    z-index: 1;
    max-width: 420px;
  }

  .brand-logo {
    width: 56px;
    height: 56px;
    margin-bottom: 24px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }

  .brand-title {
    margin: 0 0 12px;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: 1px;
    line-height: 1.3;
  }

  .brand-desc {
    margin: 0 0 32px;
    font-size: 15px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.88);
  }

  .brand-features {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.92);

      i {
        margin-right: 10px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.95);
      }
    }
  }

  .brand-decoration {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }

  .brand-decoration-1 {
    width: 320px;
    height: 320px;
    top: -80px;
    right: -60px;
  }

  .brand-decoration-2 {
    width: 240px;
    height: 240px;
    bottom: -60px;
    left: -40px;
  }

  .login-panel {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 48px 40px 24px;
    background: #fff;
    box-shadow: -8px 0 32px rgba(15, 23, 42, 0.06);
  }

  .login-panel-inner {
    width: 100%;
    max-width: 360px;
  }

  .login-form-header {
    margin-bottom: 32px;
  }

  .login-form-title {
    margin: 0 0 8px;
    font-size: 26px;
    font-weight: 600;
    color: #303133;
  }

  .login-form-subtitle {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }

  .login-form {
    ::v-deep .el-form-item {
      margin-bottom: 22px;
    }

    ::v-deep .el-input__inner {
      height: 44px;
      line-height: 44px;
      border-radius: 8px;
    }

    ::v-deep .el-input__prefix {
      left: 12px;
    }

    ::v-deep .el-input--prefix .el-input__inner {
      padding-left: 40px;
    }
  }

  .login-error {
    margin-bottom: 18px;
  }

  .login-submit-item {
    margin-bottom: 0;
    margin-top: 8px;

    ::v-deep .el-form-item__content {
      line-height: normal;
    }
  }

  .login-submit-btn {
    width: 100%;
    height: 44px;
    font-size: 15px;
    letter-spacing: 2px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);

    &:hover,
    &:focus {
      background: linear-gradient(135deg, #3a8ee6 0%, #5ca9f5 100%);
    }
  }

  .login-footer {
    margin-top: auto;
    padding-top: 32px;
    font-size: 12px;
    color: #c0c4cc;
  }

  @media (max-width: 900px) {
    .login-page {
      flex-direction: column;
    }

    .login-brand {
      flex: none;
      padding: 36px 24px 32px;
    }

    .brand-title {
      font-size: 24px;
    }

    .brand-features {
      display: none;
    }

    .login-panel {
      width: 100%;
      flex: 1;
      box-shadow: none;
      padding: 32px 24px 24px;
    }
  }
</style>
