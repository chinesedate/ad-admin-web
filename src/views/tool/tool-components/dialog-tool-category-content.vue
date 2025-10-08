<template>
  <div class="dialog-content">
    <span>添加分类</span>
    <div class="tool-category-name-wrapper">
      <span class="tool-category-name-title">分类名称：</span>
      <el-input
          class="tool-category-name-input"
          placeholder="请输入分类名称"
          size="mini"
          v-model="categoryName">
      </el-input>
    </div>
    <div class="tool-category-label-wrapper">
      <span>标签信息：</span>
      <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag
      </el-button>
    </div>
    <div class="tool-category-desc-wrapper">
      <span class="tool-category-desc-title">简短描述：</span>
      <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          class="tool-category-desc-input"
          v-model="textarea">
      </el-input>
    </div>
    <el-divider></el-divider>
    <span>编辑标签</span>
    <div class="tool-category-list tab-wrapper">

      <ul class="infinite-list" v-infinite-scroll="dialogLoadCategory" :infinite-scroll-disabled="disabled"
      >
        <li v-for="dialogToolCategory in categoryList" :key="dialogToolCategory.categoryId"
            class="infinite-list-item dialog-category-item">
          <div class="dialog-category-head"><h4><span class="title"
                                                      :title="dialogToolCategory.categoryName">{{dialogToolCategory.categoryName}}</span>：
          </h4>
          </div>
          <div class="dialog-category-body">
            <div class="dialog-category-label-items">
              <div class="g-clearfix">
                <a v-for="label in dialogToolCategory.categoryLabels" :key="label.labelId"
                   class="dialog-label-item">{{label.labelName}}</a>
              </div>
            </div>
            <div class="category-buttons"></div>
          </div>
        </li>
      </ul>
      <p class="dialog-category-tip" v-if="loading">加载中...</p>
      <p class="dialog-category-tip" v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>
import {pageListToolCategory} from "../../../api/tool";

export default {
  name: "dialog-tool-category-content",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      hasNext: false,
      categoryList: [],
      categoryName: '',
      loading: false,
      dynamicTags: ['标签一', '标签二', '标签三'],
      showInput: '',
      inputVisible: true,
      inputValue: 'aaa',
      textarea: ''
    }
  },
  props: {},
  methods: {
    handleClose() {

    },
    /**
     * 对话框下滑加载更多分类信息
     */
    dialogLoadCategory() {
      if (this.hasNext) {
        this.pageNum = this.pageNum + 1;
        // 显示加载状态
        this.loading = true;
        pageListToolCategory({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          data: {questionId: 1111}
        }).then(res => {
              if (res.data.data != null) {
                this.categoryList.push(...res.data.data.list);
                this.total = res.data.data.total;
                this.hasNext = res.data.data.hasNext;
              }
            }
        );
        // 隐藏加载状态
        this.loading = false;
      }

    },
    handleInputConfirm() {

    },
    dataUpdate() {
      this.$emit('updateData', {})
    }
  },
  computed: {
    noMore() {
      return this.hasNext === false;
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  created() {
    // 查询工具分类列表前，先将分页信息重置
    pageListToolCategory({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      data: {questionId: 1111}
    }).then(res => {
          if (res.data.data != null) {
            let resultData = res.data.data;
            this.categoryList = resultData.list;
            this.total = resultData.total;
            this.hasNext = resultData.hasNext;
          }
        }
    );
  }
}
</script>

<style lang="scss" scoped>
.tab-wrapper {
  height: 200px;
  overflow: auto;
}

.dialog-category-head {
  position: absolute;
  left: 11px;
  top: 9px;
  color: #999;
}

.dialog-category-body {
  padding: 0 100px 0 100px;
}

.dialog-category-body a {
  cursor: default;
}

.dialog-category-body a:hover {
  color: #f40;
}

.dialog-category-item {
  position: relative;
}

.dialog-category-label-items {
  min-height: 36px;
}

.dialog-label-item {
  float: left;
  margin: 9px 40px 9px 0;
  height: 18px;
  color: #000;
  text-decoration: none;
}

.dialog-category-tip {
  text-align: center;
  padding: 10px 0;
}
/**
 * 对话框内的工具分类标签信息
 */
.tool-category-name-wrapper {
  display: flex;
  align-items: center;
}

.tool-category-name-input {
  width: 200px;
}

.tool-category-label-wrapper {
  margin-top: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.tool-category-desc-wrapper {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.tool-category-desc-input {
  width: 400px;
}
</style>