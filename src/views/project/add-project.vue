<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="project-tip grid-content bg-purple">
          <h4>添加项目</h4>
          <p>项目对应web程序，管理该程序对外的接口</p>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <el-form class="project-form" ref="projectForm" :model="form" :rules="rules" label-position="top" label-width="80px">
            <el-form-item label="项目名称" prop="name">
              <el-input class="project-form-name" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="项目介绍" prop="desc">
              <el-input class="project-form-desc" type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="项目团队">
              <el-select v-model="form.team" placeholder="请选择活动区域">
                <el-option label="团队一" value="shanghai"></el-option>
                <el-option label="团队二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目成员">
              <el-select v-model="form.member" placeholder="请选择活动区域">
                <el-option label="成员一" value="shanghai"></el-option>
                <el-option label="成员二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addProject('projectForm')">立即创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {addProject} from "@/api/api-project";

  export default {
    name: "add-project",
    data() {
      return {
        form: {
          name: '',
          desc: '',
          team: [],
          member: []
        },
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      addProject(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addProject({
              projectName: this.form.name,
              projectDesc: this.form.desc
            }).then(res => {
                console.log(res.data.data)
                let {id} = res.data.data;
                this.$router.push({path: `/project/${id}`});
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

  .project-form {
    width: 60%;
    margin-left: 10px;
  }

  .project-form-name {
    width: 300px;
  }

  .project-form-desc {
    width: 400px;
  }
</style>
