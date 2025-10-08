<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="project-tip grid-content bg-purple">
          <h4>接口来源</h4>
          <p>目前接口来源支持请求解析swagger与knife4j的接口</p>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <el-form class="source-form" ref="sourceForm" :model="form" :rules="rules" label-position="top"
                   label-width="80px">
            <el-form-item label="来源名称" prop="name">
              <el-input class="source-form-name" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="来源类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio label="knife4j">knife4j</el-radio>
                <el-radio label="swagger">swagger</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="请求方法" prop="method">
              <el-radio-group v-model="form.method">
                <el-radio label="GET">GET</el-radio>
                <el-radio label="POST">POST</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="接口地址" prop="url">
              <el-input class="source-form-url" v-model="form.url"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="desc">
              <el-input class="source-form-desc" type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSource('sourceForm')">立即添加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {addSource} from "@/api/api-source";

  export default {
    name: "add-source",
    data() {
      return {
        form: {
          name: '',
          url: '',
          type: 'knife4j',
          method: 'GET',
          desc: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入接口来源名称', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请填写接口来源地址', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '选择类型', trigger: 'blur'}
          ],
          method: [
            {required: true, message: '选择地址请求方法', trigger: 'blur'}
          ],
          desc: [
            {required: false, message: '请填写介绍信息', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      addSource(formName) {
        console.log(this.form);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addSource({
              sourceName: this.form.name,
              sourceDesc: this.form.desc,
              url: this.form.url,
              sourceType: this.form.type,
              requestMethod: this.form.method
            }).then(res => {
                console.log(res.data.data)
                let {id} = res.data.data;
                this.$router.push({path: `/source/${id}`});
              }
            ).catch(error => {
              console.log(error);
              this.$notify.error({
                title: '提示',
                message: "添加出错",
                duration: 10000,
                position: 'bottom-left'
              });
            });


            return true;
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .project-tip {
    padding-left: 15px;
    padding-right: 15px;
  }

  .project-tip h4, p {
    margin-bottom: 10px;
  }

  .project-tip p {
    font-size: 14px;
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  /*.bg-purple-dark {*/
  /*  background: #99a9bf;*/
  /*}*/

  /*.bg-purple {*/
  /*  background: #d3dce6;*/
  /*}*/

  /*.bg-purple-light {*/
  /*  background: #e5e9f2;*/
  /*}*/

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .source-form {
    width: 60%;
    margin-left: 10px;
  }

  .source-form-name {
    width: 300px;
  }

  .source-form-url {
    width: 500px;
  }

  .source-form-desc {
    width: 500px;
  }
</style>
