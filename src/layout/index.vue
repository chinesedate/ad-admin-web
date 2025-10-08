<template>
  <el-container style="width: 100%;height: 100%">
    <el-header class="header-wrapper">
      <div class="header-content" @click="headerClick">
        <span>审核平台</span>
      </div>
      <div class="header-menu">
        <div v-if="isLogin" class="header-menu-item">
          <el-button type="text" @click="handleLogout">退出</el-button>
        </div>
        <!--        <el-dropdown class="header-menu-item" :show-timeout="20">-->
        <!--          <span class="el-dropdown-link">-->
        <!--            项目<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
        <!--          </span>-->
        <!--          <el-dropdown-menu slot="dropdown">-->
        <!--            <el-dropdown-item>技术大神</el-dropdown-item>-->
        <!--            <el-dropdown-item>api++</el-dropdown-item>-->
        <!--            <el-dropdown-item>小黑板</el-dropdown-item>-->
        <!--            <el-dropdown-item disabled>双皮奶</el-dropdown-item>-->
        <!--            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
        <!--        <el-dropdown class="header-menu-item" :show-timeout="20">-->
        <!--          <span class="el-dropdown-link">-->
        <!--            团队<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
        <!--          </span>-->
        <!--          <el-dropdown-menu slot="dropdown">-->
        <!--            <el-dropdown-item>黄金糕</el-dropdown-item>-->
        <!--            <el-dropdown-item>狮子头</el-dropdown-item>-->
        <!--            <el-dropdown-item>螺蛳粉</el-dropdown-item>-->
        <!--            <el-dropdown-item disabled>双皮奶</el-dropdown-item>-->
        <!--            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
      </div>
    </el-header>
    <el-container>
      <el-aside class="aside-menu" width="140px">
        <ul class="menu-list">
          <li class="menu-item">
            <router-link to="/home">主页</router-link>
          </li>
          <li class="menu-item">
            <router-link to="/qa-info-audit">问答审核</router-link>
          </li>
          <li class="menu-item">
            <router-link to="/qa-answer-audit">问答回复审核</router-link>
          </li>
          <li class="menu-item">
            <router-link to="/qa-tab-audit">标签页审核</router-link>
          </li>
          <li class="menu-item">
            <router-link to="/qa-tool-audit">问答工具审核</router-link>
          </li>
<!--          <li class="menu-item">-->
<!--            <router-link to="/tool-audit">工具审核</router-link>-->
<!--          </li>-->
<!--          <li class="menu-item">-->
<!--            <router-link to="/tool-edit">工具编辑</router-link>-->
<!--          </li>-->
          <li class="menu-item">
            <router-link to="/modify-data-audit">编辑数据</router-link>
          </li>
<!--          <li class="menu-item">-->
<!--            <router-link to="/user-edit">用户审核</router-link>-->
<!--          </li>-->
          <li class="menu-item">
            <router-link to="/name-manage">名称管理</router-link>
          </li>
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/tool-category-audit">工具分类审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/tool-category-edit">工具分类编辑</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/issue-audit">问答审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/article-audit">文章审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/article-audit">文章编辑</router-link>-->
          <!--          </li>-->
        </ul>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        activeIndex: ''
      };
    },
    computed: {
      isLogin() {
        // 校验用户是否登录，未登录时跳转登录页面（token 为undefined或''时，跳转登录页面）
        return this.$store.getters.token;
      }
    },
    methods: {
      headerClick() {
        this.$router.push('/');
      },
      handleLogout() {
        this.$store.dispatch('user/logout');
      }
    },
    mounted() {

    },
    components: {}
  }
</script>

<style lang="scss" scoped>
  .header-wrapper {
    display: flex;
    align-content: space-between;
    justify-content: space-between;
    border-bottom: solid 1px #e6e6e6;
  }

  .header-content {
    text-align: center;
    line-height: 60px;
    font-size: 30px;
    cursor: pointer;
    padding-left: 1rem;
  }

  .header-menu {
    font-weight: 700;
    color: #191E1E;
    padding-right: 300px;
    line-height: 60px;
    display: flex;
    align-content: center;
    justify-content: space-between;
  }

  .header-menu-item {
    padding-left: 20px;
  }

  .aside-menu {

    padding-top: 20px;
    border-right: solid 1px #e6e6e6;
  }

  .menu-list {
    padding-left: 30px;
  }

  .menu-item {
    padding-bottom: 10px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
