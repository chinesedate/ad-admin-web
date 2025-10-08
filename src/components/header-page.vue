<template>
  <!--  <div class="head-wrapper">-->
  <!--    <header id="header-jy">-->
  <!--      <div class="container">-->
  <!--        <div class="logo">-->
  <!--          <router-link to="/home">-->
  <!--            <img src="../assets/logo.jpg" alt="logo">-->
  <!--          </router-link>-->
  <!--        </div>-->
  <!--        <div class="header-menu">-->
  <!--          <div class="menu-right">-->
  <!--            <el-dropdown class="flex-item" v-if="!isLogin" :show-timeout="100" @command="handleCommand">-->
  <!--                              <span class="el-dropdown-link">-->
  <!--                                    用户<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
  <!--                              </span>-->
  <!--              <el-dropdown-menu slot="dropdown">-->
  <!--                <el-dropdown-item command="login">登录</el-dropdown-item>-->
  <!--                <el-dropdown-item command="signUp">注册</el-dropdown-item>-->
  <!--                <el-dropdown-item disabled>添加新书</el-dropdown-item>-->
  <!--              </el-dropdown-menu>-->
  <!--            </el-dropdown>-->
  <!--            <el-dropdown class="flex-item" v-else :show-timeout="100" @command="handleCommand">-->
  <!--                                <span class="el-dropdown-link">-->
  <!--                                <el-avatar-->
  <!--                                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar><i-->
  <!--                                    class="el-icon-arrow-down el-icon&#45;&#45;right"></i></span>-->
  <!--              <el-dropdown-menu slot="dropdown">-->
  <!--                <el-dropdown-item command="addBook">添加新书</el-dropdown-item>-->
  <!--                <el-dropdown-item command="my">我的主页</el-dropdown-item>-->
  <!--                <el-dropdown-item command="logout">退出</el-dropdown-item>-->
  <!--              </el-dropdown-menu>-->
  <!--            </el-dropdown>-->
  <!--            <div :class="{'is-show': showHeaderContent}" class="header-search flex-item">-->
  <!--              <div v-if="showContentType === 'search'">-->
  <!--                <el-input placeholder="请输入内容" v-model="keyword" @keyup.enter.native="handleBookSearch">-->
  <!--                  <el-button slot="append" icon="el-icon-search" @click="handleBookSearch"></el-button>-->
  <!--                </el-input>-->
  <!--              </div>-->
  <!--              <div v-else-if="showContentType === 'saveBook'" class="book-save">-->
  <!--                <el-row>-->
  <!--                  <el-button @click="handleSave">保存</el-button>-->
  <!--                  <el-button type="primary">发布</el-button>-->
  <!--                </el-row>-->
  <!--              </div>-->
  <!--            </div>-->
  <!--            <div class="slogan"><h3>一起阅读</h3></div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </header>-->
  <!--  </div>-->

  <header id="page-header">
    <div class="header-left">
      <div class="top-navigation-buttons">
        <router-link to="/home">
          <svg class="logo" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter height="200%" width="200%" y="-50%" x="-50%" id="svg_4_blur">
                <feGaussianBlur stdDeviation="0" in="SourceGraphic"/>
              </filter>
            </defs>
            <g>
              <title>background</title>
              <rect fill="#fff" id="canvas_background" height="34" width="34" y="-1" x="-1"/>
              <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
                <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>
              </g>
            </g>
            <g>
              <title>Layer 1</title>
              <ellipse ry="16" rx="16" id="svg_18" cy="15.918347" cx="15.850691" stroke-width="NaN" stroke="#ffffff"
                       fill="#ff7f00"/>
              <text stroke="#000" font-style="normal" font-weight="bold" xml:space="preserve" text-anchor="start"
                    font-family="'League Gothic', sans-serif" font-size="14" id="svg_1" y="19.96692" x="0.631732"
                    stroke-width="0" fill="#ffffff">api</text>
              <text stroke="#000" filter="url(#svg_4_blur)" font-style="normal" font-weight="bold" xml:space="preserve"
                    text-anchor="start" font-family="'League Gothic', sans-serif" font-size="16" id="svg_3"
                    y="25.841422" x="19.624169" stroke-opacity="null" stroke-width="0" fill="#ffffff">+</text>
              <text font-style="normal" font-weight="bold" xml:space="preserve" text-anchor="start"
                    font-family="'League Gothic', sans-serif" font-size="16" id="svg_4" y="16.365898" x="19.624169"
                    stroke-opacity="null" stroke-width="0" stroke="#000" fill="#ffffff">+</text>
              <path id="svg_17" d="m-85.618237,-33.568129l0.745,-1.30375l0.745,1.30375l-1.49,0z" fill-opacity="null"
                    stroke-opacity="null" stroke-width="null" stroke="#000" fill="none"/>
            </g>
          </svg>
        </router-link>
        <router-link to="/tool">
          <div class="top-navigation-button">
            <div class="navigation-item">工具</div>
          </div>
        </router-link>
        <router-link to="/tool-audit">
          <div class="top-navigation-button">
            <div class="navigation-item">工具审核</div>
          </div>
        </router-link>
        <router-link to="/tool-category-audit">
          <div class="top-navigation-button">
            <div class="navigation-item">工具分类审核</div>
          </div>
        </router-link>
      </div>
    </div>
    <!--    <div class="header-search" ref="header_search">-->
    <!--      <div v-if="searchBoxType === 'dummy'" @click.stop="dummySearchBoxClick" class="search-box">-->
    <!--        <div class="input-search-group">-->
    <!--          <div class="dummy-search-input">-->
    <!--            <div class="search-icon"><i class="el-icon-search"></i></div>-->
    <!--            <div class="search-content">搜索</div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div v-else-if="searchBoxType === 'popup'" class="search-box-popup">-->
    <!--        <div class="popup-search-wrapper"></div>-->
    <!--        <div class="popup-search-filter"></div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="header-right">
      <div>
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
        </el-avatar>
      </div>
    </div>
  </header>
</template>

<script>
  import {off, on} from 'element-ui/src/utils/dom';

  export default {
    name: "header-page",
    props: {
      showHeaderContent: Boolean,
      showContentType: {
        type: String,
        default: 'search'
      }
    },
    data() {
      return {
        keyword: '',
        searchBoxType: 'dummy'
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'login') {
          this.$router.push('/login');
        } else if (command === 'signUp') {
          this.$router.push('/sign-up');
        } else if (command === 'addBook') {
          this.$router.push('/book/add');
        } else if (command === 'my') {
          this.$router.push('/user/1/account');
        } else if (command === 'logout') {
          this.$store.dispatch('user/logout');
        }
      },
      handleBookSearch() {

      },
      handleSave() {

      },
      dummySearchBoxClick() {
        this.searchBoxType = 'popup';
      },
      handleDocumentClick(e) {
        let self = this;
        if (this.$refs.header_search && !this.$refs.header_search.contains(e.target)) {
          if (self.searchBoxType === 'popup') {
            self.searchBoxType = 'dummy';
          }
        }
        // const search_dummy = this.$refs.search_dummy;
        // const search_popup = this.$refs.search_popup;
        // console.log(search_popup);
        // console.log(e.target)
        // if (search_dummy || search_dummy.contains(e.target)) {
        //   console.log("aaaaa")
        //   this.searchBoxType = 'popup';
        // }
        // if (this.searchBoxType === 'popup' && (search_popup && search_popup.contains(e.target))) {
        //   console.log("bbbbb")
        //   this.searchBoxType = 'dummy';
        // }
      }
    },
    computed: {
      isLogin() {
        // 校验用户是否登录，未登录时跳转登录页面（token 为undefined或''时，跳转登录页面）
        return this.$store.getters.token;
      }
    },
    mounted() {
      on(document, 'click', this.handleDocumentClick);
    },
    destroyed() {
      off(document, 'click', this.handleDocumentClick);
    }
  }
</script>

<style lang="scss" scoped>
  #page-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 0 0 48px;
    box-shadow: inset 0 -1px 0 #E6E6E6;
  }

  .header-left {
    margin-left: 350px;
  }

  .header-right {
    margin-right: 350px;
  }



  .header-left .top-navigation-buttons {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .top-navigation-buttons .logo {
    margin-left: 8px;
  }

  .top-navigation-button {
    padding: 12px 20px;
    cursor: pointer;
    color: #6B6B6B;
    font-size: 14px;
    font-weight: 600;
  }

  .top-navigation-button:hover {
    color: #212121;
  }

  .navigation-item {
    font-size: 14px;
    line-height: 20px;
  }

  .search-box {
    position: relative;
    width: 15vw;
    min-width: 160px;
    max-width: 320px;
    cursor: text;
  }


  .input-search-group {
    height: 32px;
    background-color: #F2F2F2;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dummy-search-input {
    display: flex;
    justify-content: center;
    height: 20px;
  }

  .dummy-search-input .search-icon {
    line-height: 20px;
    color: #6B6B6B;
  }

  .dummy-search-input .search-content {
    line-height: 20px;
    font-size: 12px;
    color: #6B6B6B;
    margin-left: 2px;
  }

  .header-search {
    position: relative;
  }

  .search-box-popup {
    position: absolute;
    top: -5px;
    left: -500px;
    width: 700px;
    height: 100px;
    /*border: 1px solid #E6E6E6;*/
    box-shadow: -2px 0px 2px #E6E6E6, /*左边阴影*/
    0px -1px 1px #E6E6E6, /*上边阴影*/
    2px 0px 2px #E6E6E6, /*右边阴影*/
    0px 3px 3px #E6E6E6; /*下边阴影*/
    z-index: 1000;
    background-color: #FFFFFF;
  }


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

  //.logo {
  //  display: flex;
  //  align-items: center;
  //  vertical-align: center;
  //  margin-right: 30px;
  //}

  //.logo img {
  //  width: 40px;
  //  height: 40px;
  //  margin-top: 10px;
  //}

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
    /*margin-left: 100px;*/
  }

  .login {
    margin-left: 40px;
  }

  .avatar {
    margin-left: 40px;
    cursor: pointer;
  }

  .slogan {
    margin-left: 100px;
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

  .flex-item {
    flex-shrink: 0
  }

  /*.header-search {*/
  /*  width: 600px;*/
  /*  margin-left: 20px;*/
  /*  visibility: hidden;*/
  /*}*/

  /*.header-search.is-show {*/
  /*  visibility: visible;*/
  /*}*/

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
