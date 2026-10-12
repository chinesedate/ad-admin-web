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
      </div>
    </el-header>
    <el-container>
      <el-aside class="aside-menu" width="220px">
        <el-menu
          class="side-nav-menu"
          :default-active="activeIndex"
          @select="handleMenuSelect">
          <el-menu-item
            v-for="menu in visibleMenus"
            :key="menu.index"
            :index="menu.index">
            <i :class="menu.icon"></i>
            <span slot="title">{{ menu.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import menus from '@/config/menus'

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
        activeIndex: this.menuIndex,
        menus: menus
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
      },
      /**
       * 按当前用户的权限点过滤后的菜单
       */
      visibleMenus() {
        return this.menus.filter(menu => this.$store.getters.hasPerm(menu.permission));
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
        const menu = this.menus.find(item => item.index === menuIndex);
        if (!menu) {
          return;
        }
        this.activeIndex = menu.index;
        if (this.$route.path !== menu.path) {
          this.$router.push(menu.path);
        }
      },
      /**
       * 根据当前路由高亮对应菜单，支持详情页等子路径
       */
      syncActiveFromRoute() {
        const path = this.$route.path;
        const matched = this.menus.find(menu =>
          (menu.prefixes || []).some(prefix => path === prefix || path.startsWith(prefix + '/')));
        this.activeIndex = matched ? matched.index : '';
      }
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
