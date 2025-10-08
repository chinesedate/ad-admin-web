<template>
  <div class="layout">
    <div class="main-page">
      <router-view/>
    </div>

    <router-view name="footer"></router-view>
  </div>
</template>
<script>
export default {
  name: "home-layout",
  data() {
    return {
      activeIndex: '',
      activeIndex2: '1',
      restaurants: [],
      state: '',
      timeout: null,
      keyword: '',
    };
  }
}
</script>

<style lang="scss" scoped>
.layout {
  padding-top: 60px;
  min-width: 1024px;
}

.head-wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1500;
}

#header-jy {
  background-color: #fafafb;
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.05);
}

.container {
  width: 1190px;
  margin: 0 auto;
  display: flex;
}

.header-menu {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.logo img {
  width: 40px;
  height: 40px;
}

.el-button {
  margin: 0 !important;
}

.el-menu-demo {
  border-bottom: none !important;
  height: 100%;
}

.el-menu {
  background-color: #fafafb !important;
}

.menu-right {
  display: flex;
  align-items: center;
}

.login {
  margin-left: 40px;
}

.avatar {
  margin-left: 40px;
  cursor: pointer;
}


.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}

.main-page {
  width: 1180px;
  min-height: 800px;
  margin: 0 auto;
}

.foot-content {
  padding: 0 150px;
  margin: 10px 0;
  border-top: solid 1px #ddd;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
