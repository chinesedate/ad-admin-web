<template>
  <div class="home">
    <header-page :show-header-content="showHeaderContent" show-content-type="search"></header-page>
    <div class="home-search" :class="{'is-hide': showHeaderContent}">
      <el-input placeholder="请输入内容" v-model="keyword" @keyup.enter.native="handleBookSearch(false)">
        <el-button slot="append" icon="el-icon-search" @click="handleBookSearch(false)"></el-button>
      </el-input>
    </div>
    <div class="content">
      <div class="search-result">
        <div v-if="books.length === 0">
          <p>没有搜索到内容</p>
          <el-button @click="handleAddBook" type="text">去添加书本</el-button>
        </div>
        <div v-else>
          <ul class="book-list">
            <li class="book-list-item" v-for="(book, index) in books" :key="index">
              <!--仅文字-->
              <div v-if="book.viewType === 0" class="book-item book-item-text"
                   @click="handleBookClick(book.id)">
                <p>{{ book.title }}</p>
                <p>{{ book.synopsis }}</p>
              </div>
              <!--单图-->
              <div v-if="book.viewType === 1" class="book-item book-item-one-image"
                   @click="handleBookClick(book.id)">
                <div class="one-image">
                  <img class="image" :src="book.image.src" alt="book img">
                </div>
                <div class="book-content">
                  <p>{{ book.title }}</p>
                  <p>{{ book.synopsis }}</p>
                </div>
              </div>
              <!--三图-->
              <div v-if="book.viewType === 2" class="book-item book-item-three-image"
                   @click="handleBookClick(book.id)">
                <!--三图上依次展示书名、作者、评分-->
                <div class="book-info">
                  <p>
                    <span class="book-title">{{ book.title }}</span>
                    <span>{{ book.authors}}</span>
                    <span>{{ book.score }}</span>
                  </p>
                </div>
                <ul class="three-image">
                  <li v-for="(image, imageIndex) in book.imageList" :key="imageIndex"
                      :class="[imageIndex === 0  ? 'head-image' : '', imageIndex ===2 ? 'tail-image' : '']">
                    <img class="three-image-item image" :src="image.src" alt="book img">
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">没有更多了</p>
        </div>
      </div>
      <div class="recommend-view" :class="{'is-position-fixed': positionFixed}" :style="{right: rightLength}">
        <p>推荐列表</p>
        <ul class="recommend-list">
          <li class="recommend-list-item" v-for="(recommend) in recommends" :key="recommend.id">
            <span>{{ recommend.title }}</span>
            <el-rate
                class="recommend-score"
                v-model="recommend.score"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>

          </li>
        </ul>
      </div>
    </div>
    <back-top></back-top>
  </div>
</template>

<script>
import throttle from "throttle-debounce/throttle";
import {fetchBookList, fetchRecommendBook} from "@/api/book";
import HeaderPage from '@/components/header-page';
import BackTop from '@/components/back-top';

export default {
  name: 'Home',
  data() {
    return {
      books: [],
      recommends: [],
      keyword: '',
      pageSize: 10,
      currentPage: 1,
      totalAnswer: 0,
      responseContent: '',
      positionFixed: false,
      count: 10,
      loading: false,
      showHeaderContent: false
    }
  },
  components: {
    'header-page': HeaderPage,
    'back-top': BackTop
  },
  methods: {
    handleAddBook() {
      this.$router.push({path: `/book/add`});
    },
    handleBookClick(bookId) {
      this.$router.push({path: '/book#content', query: {bookId: bookId}});
    },
    /**
     * 搜索书本列表
     * @param isAppend 查询结果是否追加到当前数据列表
     */
    handleBookSearch(isAppend) {
      this.loading = true;
      // 查询书本列表
      fetchBookList({
        pageNum: 0,
        pageSize: this.pageSize,
        data: {keyword: this.keyword}
      }).then(res => {
        if (res.data.data.list != null) {
          if (isAppend) {
            for (let book of res.data.data.list) {
              this.books.push(book);
            }
          } else {
            this.books = res.data.data.list;
          }
        }
        this.loading = false;
      });
      // 查询推荐列表
      fetchRecommendBook({content: this.keyword}).then(
          res => {
            this.recommends = res.data.data;
          }
      );
    },
    /**
     * 页面滚动处理-以便页面滑动到底部时加载书本列表
     * @param event 滚动事件信息
     */
    handleScroll(event) {
      let scrollTop = event.target.scrollingElement.scrollTop;    // 获取页面滚动高度
      let clientHeight = event.target.scrollingElement.clientHeight; // 获取窗口高度
      let scrollHeight = event.target.scrollingElement.scrollHeight; // 获取当前元素高度
      console.log('ssdsfsdfsd')
      // 判断当前页面是否滚动到底部
      if (scrollTop + clientHeight >= scrollHeight) {
        this.handleBookSearch(true);
      }
      this.positionFixed = scrollTop >= 60;
      if (this.showHeaderContent) {
        if (scrollTop < 60) {
          this.showHeaderContent = false;
        }
      } else {
        if (scrollTop >= 60) {
          this.showHeaderContent = true;
        }
      }
    }
  },
  computed: {
    noMore() {
      return this.count >= 20
    },
    disabled() {
      return this.loading || this.noMore
    },
    // 计算推荐栏距右边的距离
    rightLength: function () {
      if (this.positionFixed) {

        // if (document.body.clientWidth > 1180){
        return (document.body.clientWidth - 1180) / 2 + 'px';
        // }

      } else {
        return '0px';
      }

    }
  },
  created() {
    this.handleBookSearch(false);
  },
  mounted() {
    this.bookListPage = document;
    this.throttledScrollHandler = throttle(200, true, this.handleScroll, true);
    //监听页面滚动事件
    this.bookListPage.addEventListener("scroll", this.throttledScrollHandler);
  },
  beforeDestroy() {
    this.bookListPage.removeEventListener('scroll', this.throttledScrollHandler);
  }
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
}

.home {
  margin-top: 100px;
}

.home-search {
  width: 560px;
  margin-left: 145px;
}

.home-search.is-hide {
  visibility: hidden;
}

.search-result {
  margin-top: 40px;
  margin-bottom: 50px;
  min-height: 800px;
}

.book-list {
  margin-left: 120px;
}


.book-item {
  cursor: pointer;
}

ul {
  list-style: none;
}

.book-item {
  padding: 10px 0;
}

.book-item:hover {
  background: #f8f8f8;
}

.book-item-one-image {
  display: flex;
}

.book-item-one-image .book-content {
  margin-left: 10px;
}

.one-image {
  border-radius: 12px;
  width: 184px;
  overflow: hidden;
}

.one-image .image {
  float: left;
}

.image {
  width: 184px;
  height: 122px;
}

.page-wrapper::after {
  clear: both;
  display: block;
  content: "";
}

.page-pagination {
  float: right;
}

.content {
  position: relative;
}

.book-list-item {
  width: 560px;
}

.three-image {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.three-image li {
  height: 122px;
}

.three-image li.head-image {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  overflow: hidden;
}

.three-image li.tail-image {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  overflow: hidden;
}

.recommend-view {
  position: absolute;
  top: 0;
  width: 260px;
  min-height: 400px;
  padding: 10px;
}

.recommend-view.is-position-fixed {
  position: fixed;
  top: 60px;
  width: 260px;
  min-height: 400px;
}

.recommend-list-item {
  margin-top: 10px;
}

.recommend-list-item span {
  vertical-align: middle;
}

.recommend-score {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}

.book-info{
  padding-left: 10px;
}

.book-title{
  font-size: 18px;
  font-weight: 700;
  color: #222;
}

</style>
