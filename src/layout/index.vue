<template>
  <el-container style="width: 100%;height: 100%">
    <el-header class="header-wrapper" height="56px">
      <div class="header-brand" @click="headerClick">
        <span class="header-logo">
          <i class="el-icon-s-platform"></i>
        </span>
        <span class="header-title">广告平台</span>
      </div>
      <div class="header-actions">
        <el-button
          v-if="isLogin"
          class="header-logout-btn"
          size="small"
          icon="el-icon-switch-button"
          @click="handleLogout">
          退出登录
        </el-button>
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
      <el-aside class="aside-menu" width="220px">
        <el-menu
          class="side-nav-menu"
          :default-active="activeIndex"
          @select="handleMenuSelect">
          <el-menu-item index="ad-data">
            <i class="el-icon-s-data"></i>
            <span slot="title">广告数据</span>
          </el-menu-item>
          <el-menu-item index="ad-link">
            <i class="el-icon-link"></i>
            <span slot="title">链接</span>
          </el-menu-item>
          <el-menu-item index="ad-channel">
            <i class="el-icon-share"></i>
            <span slot="title">渠道信息</span>
          </el-menu-item>
          <el-menu-item index="adv-media-list">
            <i class="el-icon-folder-opened"></i>
            <span slot="title">预算媒体管理</span>
          </el-menu-item>
          <el-menu-item index="adv-channel-up-down-list">
            <i class="el-icon-connection"></i>
            <span slot="title">渠道上下游</span>
          </el-menu-item>
          <el-menu-item index="adv-channel-action-list">
            <i class="el-icon-s-operation"></i>
            <span slot="title">转化配置</span>
          </el-menu-item>
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/home">主页</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/qa-info-audit">问答审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/qa-answer-audit">问答回复审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/qa-tab-audit">标签页审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/qa-tool-audit">问答工具审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/tool-audit">工具审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/tool-edit">工具编辑</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/modify-data-audit">编辑数据</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/user-edit">用户审核</router-link>-->
          <!--          </li>-->
          <!--          <li class="menu-item">-->
          <!--            <router-link to="/name-manage">名称管理</router-link>-->
          <!--          </li>-->
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
        </el-menu>
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
    props: {
      menuIndex: {
        type: String,
        default: 'ad-data'
      }
    },
    data() {
      return {
        activeIndex: this.menuIndex
      };
    },
    watch: {
      menuIndex(val) {
        this.activeIndex = val;
      },
      '$route.path'() {
        this.syncActiveFromRoute();
      }
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
      },
      handleMenuSelect(menuIndex) {
        this.handleMenuItemClick(menuIndex);
      },
      syncActiveFromRoute() {
        const path = this.$route.path;
        if (path.startsWith('/ad_data') || path === '/') {
          this.activeIndex = 'ad-data';
        } else if (path.startsWith('/ad_link')) {
          this.activeIndex = 'ad-link';
        } else if (path.startsWith('/ad_channel')) {
          this.activeIndex = 'ad-channel';
        } else if (path.startsWith('/adv_media_list')) {
          this.activeIndex = 'adv-media-list';
        } else if (path.startsWith('/adv_channel_up_down_list')) {
          this.activeIndex = 'adv-channel-up-down-list';
        } else if (path.startsWith('/adv_channel_action_list')) {
          this.activeIndex = 'adv-channel-action-list';
        }
      },
      /**
       * 处理菜单点击事件
       * @param menuIndex
       */
      handleMenuItemClick(menuIndex) {
        this.activeIndex = menuIndex;
        if (menuIndex === 'ad-data') {
          this.$router.push('/ad_data');
        } else if (menuIndex === 'ad-link') {
          this.$router.push('/ad_link/list');
        } else if (menuIndex === 'ad-channel') {
          this.$router.push('/ad_channel');
        } else if (menuIndex === 'adv-media-list') {
          this.$router.push('/adv_media_list');
        } else if (menuIndex === 'adv-channel-up-down-list') {
          this.$router.push('/adv_channel_up_down_list');
        } else if (menuIndex === 'adv-channel-action-list') {
          this.$router.push('/adv_channel_action_list');
        }
      },
    },
    mounted() {
      this.syncActiveFromRoute();
    },
    components: {}
  }
</script>

<style lang="scss" scoped>
  .header-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }

  .header-brand {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &:hover .header-title {
      color: #409eff;
    }
  }

  .header-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-right: 10px;
    border-radius: 8px;
    background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    font-size: 18px;
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    letter-spacing: 0.5px;
    transition: color 0.2s;
  }

  .header-actions {
    display: flex;
    align-items: center;
  }

  .header-logout-btn {
    color: #606266;
    border-color: #dcdfe6;

    &:hover,
    &:focus {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }

  .aside-menu {
    background-color: #fff;
    border-right: solid 1px #e6e6e6;
    overflow: hidden;
  }

  .side-nav-menu {
    border-right: none;
    padding-top: 8px;

    ::v-deep .el-menu-item {
      height: 48px;
      line-height: 48px;
      margin: 4px 8px;
      border-radius: 4px;
      color: #303133;

      i {
        color: #909399;
        margin-right: 8px;
      }

      &:hover {
        background-color: #ecf5ff;
        color: #409eff;

        i {
          color: #409eff;
        }
      }

      &.is-active {
        background-color: #ecf5ff;
        color: #409eff;
        font-weight: 500;

        i {
          color: #409eff;
        }

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 3px;
          border-radius: 0 2px 2px 0;
          background-color: #409eff;
        }
      }
    }
  }

  ::v-deep .el-main {
    background-color: #f5f7fa;
    padding: 20px 24px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
