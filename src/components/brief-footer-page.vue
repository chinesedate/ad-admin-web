<template>
  <!--简略内容页脚-->
  <div class="footer-wrapper">
    <div class="footer-content">
      <ul>
        <li>
          <router-link class="text-color" to="/about">关于技术大神</router-link>
        </li>
        <li>
          <router-link class="text-color" to="/advertisement">营销推广</router-link>
        </li>
        <li>
          <router-link class="text-color" to="/join-us">加入我们</router-link>
        </li>
        <li>
          <router-link class="text-color" to="/feedback">意见反馈</router-link>
        </li>
        <li class="text-color">© 2022 jishudashen.com</li>
      </ul>
      <div class="slogan text-color">发现好用的工具</div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "brief-footer-page"
  }
</script>

<style lang="scss" scoped>
  .footer-wrapper {
    height: 40px;
    font-size: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
  }

  .footer-content {
    width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }

  .footer-content .text-color {
    color: #bbb;
  }

  .footer-content ul {
    width: 600px;
    display: flex;
    justify-content: space-between;
  }

  .logo {
    align-items: center;
    vertical-align: center;
    margin-right: 30px;
  }

  .logo img {
    width: 20px;
    height: 20px;
  }
</style>
