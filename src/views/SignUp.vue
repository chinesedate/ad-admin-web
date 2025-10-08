<template>
    <div class="content-page">
        <h1 class="text-center">新建账户</h1>
        <el-form :model="ruleForm" label-position="top" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model.number="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {addUser} from "@/api/user";

    export default {
        name: "SignUp",
        data() {
            const checkUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                }
                callback();
            };
            const validateEmail = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入邮箱地址'));
                } else {
                    callback();
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    username: '',
                    email: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, validator: checkUsername, trigger: 'change'},
                        {min: 4, max: 16, message: '用户名长度在4~16之间', trigger: ['blur']}
                    ],
                    email: [
                        {validator: validateEmail, required: true, trigger: 'change'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur']}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'change'},
                        {required: true, min: 8, max: 16, message: '请输入8~16长度的密码', trigger: ['blur']}
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addUser(this.ruleForm).then(() => this.$router.push("/"));
                        // alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .content-page {
        width: 400px;
        margin: 64px auto 0;
    }

    .text-center {
        text-align: center;
    }

</style>
