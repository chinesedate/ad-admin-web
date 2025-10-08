<template>
  <div class="login-page">
    <div class="login-header">
      <router-link to="/">
        <div><span class="logo-content">技术问答社区-管理平台</span></div>
      </router-link>
    </div>
    <div class="login-main">
      <div class="login-main-header">
        <span class="login-main-title">
          邮箱登录
        </span>
      </div>
      <el-form :model="loginRuleForm" ref="loginRuleForm" :rules="loginRules" label-position="top"
               label-width="100px"
               class="demo-dynamic">
        <el-form-item
          prop="email"
        >
          <el-input v-model="loginRuleForm.email" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>
<!--        <el-form-item prop="verifyCode">-->
<!--          <el-input-->
<!--            placeholder="验证码"-->
<!--            v-model="loginRuleForm.verifyCode" clearable>-->
<!--            <el-button type="text" @click="fetchVerifyCode" :disabled="this.fetchVerifyCodeTimer !== -1"-->
<!--                       slot="suffix">{{fetchVerifyCodeTip}}-->
<!--            </el-button>-->
<!--          </el-input>-->
<!--        </el-form-item>-->
        <el-form-item prop="pass">
          <el-input type="password" v-model="loginRuleForm.pass" placeholder="请输入密码" autocomplete="off"
                    @keyup.enter.native="login('loginRuleForm')"
                    show-password clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('loginRuleForm')" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-footer"></div>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  import {sendEmailVerifyCode} from "@/api/user";

  export default {
    name: "login",
    data() {
      return {
        loginRuleForm: {
          email: '',
          // verifyCode: '',
          pass: '',
        },
        loginRules: {
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur']}
          ],
          // verifyCode: [
          //   {required: true, message: '请输入验证码', trigger: ['blur', 'change']}
          // ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 8, max: 16, message: '请输入8~16长度的密码', trigger: ['blur']}
          ]
        },
        // 获取验证码计时
        fetchVerifyCodeTimer: -1,
      }
    },
    computed: {
      fetchVerifyCodeTip() {
        if (this.fetchVerifyCodeTimer === -1) {
          return '获取验证码';
        } else {
          return this.fetchVerifyCodeTimer + ' 秒后可重发';
        }
      }
    },
    methods: {
      /**
       * 获取验证码
       */
      fetchVerifyCode() {
        // 获取验证码前，对邮箱进行校验
        let userEmail = this.loginRuleForm.email;

        this.$refs.loginRuleForm.validateField('email', (errorMsg) => {
          // 通过errorMsg是否有值来判断是否校验通过
          if (!errorMsg) {
            this.fetchVerifyCodeTimer = 60;
            let timer = setInterval(() => {
              if (this.fetchVerifyCodeTimer > 1) {
                this.fetchVerifyCodeTimer = this.fetchVerifyCodeTimer - 1;
              } else {
                this.fetchVerifyCodeTimer = -1;
              }
            }, 1000);
            setTimeout(() => {
              clearTimeout(timer);
            }, 1000 * 62);
            // 验证通过时，访问接口请求验证码
            sendEmailVerifyCode({email: userEmail});
          }
        })
      },
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('user/login', {
              username: this.loginRuleForm.email,
              password: md5(this.loginRuleForm.pass),
              // verifyCode:this.loginRuleForm.verifyCode
            }).then(() => this.$router.push("/")).catch(error => {
              console.log(error);
              // this.$notify.error({
              //   title: '提示',
              //   message: "登录出错",
              //   duration: 10000,
              //   position: 'bottom-left'
              // });
            })

            return true;
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .login-page {
    margin: 0 auto;
    background-color: #fff;
    height: 100%;
  }

  .login-header {
    padding-top: 150px;
    text-align: center;
  }

  .logo-content {
    font-size: 24px;
    font-weight: 600;
  }

  .login-main {
    width: 280px;
    margin: 20px auto 0;
    padding: 20px 20px;
    border-radius: 6px;
    border: 1px solid #d0d7de;
    box-sizing: border-box;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  }

  .login-main-header {
    padding-bottom: 20px;
  }

  .login-main-title {
    line-height: 24px;
    font-size: 18px;
    color: #303133;
  }

  .auth-choose-button-wrapper {
    display: flex;
    flex-direction: row-reverse;

    .auth-choose-button {
      padding-left: 5px;
    }
  }
</style>
