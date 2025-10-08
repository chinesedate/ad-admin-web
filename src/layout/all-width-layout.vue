<template>
  <div class="layout">
    <div class="head-wrapper">
      <header id="header-jy">
        <div class="container">
          <div class="logo">
            <router-link to="/home">
              <img src="../assets/logo.jpg" alt="logo">
            </router-link>
          </div>
          <div class="header-menu">
            <div class="menu-right">
              <el-dropdown v-if="!isLogin" :show-timeout="100" @command="handleCommand">
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span class="el-dropdown-link">
                                    点击登录<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="login">登录</el-dropdown-item>
                  <el-dropdown-item command="signUp">注册</el-dropdown-item>
                  <el-dropdown-item disabled>添加新书</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-else :show-timeout="100" @command="handleCommand">
                                <span class="el-dropdown-link">
                                <el-avatar
                                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar><i
                                    class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="addBook">添加新书</el-dropdown-item>
                  <el-dropdown-item command="my">我的主页</el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </header>
    </div>
    <div class="main-page">
      <router-view />
    </div>
    <div class="foot-wrapper">
      <router-view name="footer"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "all-width-layout",
  data() {
    return {
      activeIndex: '',
      activeIndex2: '1',
      restaurants: [],
      state: '',
      timeout: null
    };
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
    handleSelectTab(key) {
      switch (key) {
        case "1":
          this.$router.push("/read");
          break;
        case "2":
          this.$router.push("/qa");
          break;
        case "3":
          this.$router.push("/blog");
          break;
        default:
          break;
      }
    },
    loadAll() {
      return [
        {"value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号"},
        {"value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号"},
        {"value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113"},
        {"value": "泷千家(天山西路店)", "address": "天山西路438号"},
        {"value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101"},
        {"value": "贡茶", "address": "上海市长宁区金钟路633号"},
        {"value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号"},
        {"value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号"},
        {"value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107"},
        {"value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号"},
        {"value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号"},
        {"value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号"},
        {"value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F"},
        {"value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层"},
        {"value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13"}
      ];
    },
    querySearchAsync(queryString, cb) {
      const restaurants = this.restaurants;
      const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    handleSelect(item) {
      console.log(item);
    },
    handleLogin() {
      this.$router.push('/login')
    },
    handleSignUp() {
      this.$router.push('/sign-up')
    },
    handAvatarClick() {
      this.$router.push("/user/123")
    }
  },
  computed: {
    isLogin() {
      // 校验用户是否登录，未登录时跳转登录页面（token 为undefined或''时，跳转登录页面）
      return this.$store.getters.token;
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
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
  padding-left: 1000px;
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
  //width: 1180px;
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