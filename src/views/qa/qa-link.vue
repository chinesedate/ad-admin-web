<template>
  <div tabindex="-1" :class="['link-info-item',isClick === true? 'item-selected':'']" @click="itemClick"
       @blur="itemBlur" @dblclick="itemDoubleClick">
    <!--该组件展示链接信息（网站图标、网页title、网页链接）-->
    <div class="website-icon">
      <img v-if="qaLink.iconImgBase64" :src="qaLink.iconImgBase64" alt="">
      <img v-else src="../../assets/default_link_icon.png" alt="">
    </div>

    <!--当网页title不存在时，仅展示url信息-->
    <div class="website-text">
      <div v-if="qaLink.linkTitle" class="website-title elided-text" :title="qaLink.linkTitle">
        <span>{{qaLink.linkTitle}}</span>
      </div>
      <div v-else class="website-title elided-text" :title="qaLink.linkUrl"><span>{{qaLink.linkUrl}}</span></div>
      <div v-show="isClick" @click="itemDoubleClick" class="website-url elided-text" :title="qaLink.linkUrl"><span
        :class="{'text-is-click': isClick}">{{qaLink.linkUrl}}</span>
      </div>
      <!--      <a :href="qaLink.linkUrl" class="website-url elided-text" target="_blank">-->
      <!--        <div class="link-url">{{qaLink.linkUrl}}</div>-->
      <!--      </a>-->
    </div>
    <div v-show="isClick" class="website-more" title="更多操作">
      <el-dropdown trigger="click" placement="bottom" :hide-on-click="false">
        <!--  <span class="el-dropdown-link">-->
        <!--    下拉菜单<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
        <!--  </span>-->
        <vertical-more style="display: block;width: 16px;height: 16px"></vertical-more>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
import VerticalMore from '@/svg/vertical-more.svg';

export default {
  name: "qa-link",
  props: {
    qaLink: Object
  },
  data() {
    return {
      isClick: false,
      isDoubleClick: false
    }
  },
  components: {
    'vertical-more': VerticalMore
  },
  methods: {
    /**
     * 点击时触发
     */
    itemClick() {
      this.isClick = true;
    },
    /**
     * 失去焦点时触发
     */
    itemBlur() {
      if (!this.isDoubleClick) {
        this.isClick = false;
      } else {
        this.isDoubleClick = false;
      }
    },
    /**
     * 链接双击时跳转新页面打开链接
     */
    itemDoubleClick() {
      this.isDoubleClick = true;
      window.open(this.qaLink.linkUrl, '_blank');
    }
  }
}
</script>

<style lang="scss" scoped>
  .link-info-item {
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 40px;
    padding: 0 20px;
    cursor: default;
    user-select: none;
    font-size: 14px;
  }

  .link-info-item.item-selected {
    background-color: #fff;
  }


  .website-icon {
    width: 16px;
    height: 16px;
    margin: 2px;

    img {
      width: 16px;
      height: 16px;
    }
  }

  .website-text {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .website-title {
    margin-inline-start: 20px;
    flex: 0 auto;
  }

  .website-url {
    margin-inline-start: 20px;
    flex: 1;
  }

  .elided-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-is-click {
    cursor: pointer;
    text-decoration: underline;
  }

  .website-more {
    padding: 8px;
    margin-left: 5px;
  }

  .website-more:hover {
    border-radius: 50%;
    background-color: #f2f2f2;
  }
</style>
