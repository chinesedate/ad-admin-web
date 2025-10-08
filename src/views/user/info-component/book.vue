<template>
  <div>
    <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" suffix-icon="el-icon-search">
    </el-input>
    <div v-if="pageBook.total === undefined || pageBook.total === 0" class="search-result">
      <p>
        <span> 当前还未添加书本,</span>
        <router-link to="/book/add">
          <el-link type="primary">去添加书本</el-link>
        </router-link>
      </p>
    </div>
    <div v-else class="book-list-wrapper search-result">
      <ul class="book-list">
        <li class="book-list-item" v-for="(book, index) in pageBook.list" :key="index">
          <div class="handle-wrapper">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="delete" :bookId="book.id">删除</el-dropdown-item>
                <el-dropdown-item command="hide" :bookId="book.id">隐藏</el-dropdown-item>
                <el-dropdown-item command="top" :bookId="book.id">置顶</el-dropdown-item>
                <el-dropdown-item command="label" :bookId="book.id">加标签</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="book-item" @click="handleBookClick(book.id)">
            <div class="one-image">
              <img class="image" :src="book.image.src" alt="book img">
            </div>
            <div class="book-content">
              <p>{{ book.title }}</p>
              <p>{{ book.synopsis }}</p>
            </div>
          </div>
          <el-divider></el-divider>
        </li>
      </ul>
      <el-pagination
          :current-page.sync="currentPage"
          :page-size="pageBook.size"
          layout="total, prev, pager, next"
          :total="pageBook.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {fetchPersonalBookList, removePersonalBook} from "@/api/book";

export default {
  name: "book",
  data() {
    return {
      keyword: '',
      currentPage: 1,
      pageSize: 10,
      pageBook: {}
    }
  },
  methods: {
    queryBookList() {
      // 查询书本列表
      fetchPersonalBookList({
        pageNum: this.currentPage - 1,
        pageSize: this.pageSize,
        data: {keyword: this.keyword}
      }).then(res => {
        if (res.data.data != null) {
          this.pageBook = res.data.data;
        }
      });
    },
    /**
     * 处理书本点击事件
     * @param bookId 书本id
     */
    handleBookClick(bookId) {
      this.$router.push({path: '/book#content', query: {bookId: bookId}});
    },
    /**
     * 处理书本列表下拉操作菜单命令
     * @param command 操作命令
     * @param dropdownItem 下拉菜单项
     */
    handleCommand(command, dropdownItem) {
      if (command === 'delete') {
        // 删除书本
        removePersonalBook(dropdownItem.$attrs.bookId).then(() => {
          this.queryBookList();
        });
      } else if (command === 'hide') {
        this.$router.push('/sign-up');
      } else if (command === 'top') {
        this.$router.push('/book/add');
      } else if (command === 'label') {
        this.$router.push('/user/1/account');
      }
    },
  },
  created() {
    this.queryBookList();
  },
}
</script>

<style scoped>
.search-result {
  margin-top: 50px;
}

.book-list-wrapper {

}

.book-list-item {
  position: relative;
}

.book-list-item + .book-list-item {
  margin-top: 10px;
}

.book-item {
  width: 560px;
  height: 142px;
  display: flex;
}

.book-content {
  margin-left: 10px;
}

.handle-wrapper {
  position: absolute;
  top: 0;
  right: 0;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.image {
  width: 150px;
  height: 150px;
}
</style>
