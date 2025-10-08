<template>
  <div id="tool-page">
    <div class="tool-search">
      <el-input placeholder="请输入内容" v-model="toolSearchContent" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="tool-label">
      <span>所有分类 > </span>
      <el-tag v-for="(chooseCategory,index) in chooseCategoryList" :key="chooseCategory.categoryId"
              @click="removeCategoryLabelChoose(chooseCategory,index)"
              @close="removeCategoryLabelChoose(chooseCategory,index)"
              class="choose-category-tag"
              :disable-transitions="true"
              size="mini" closable>{{chooseCategory.chooseContent}}
      </el-tag>
    </div>
    <div :class="[showToolCategoryList.length === 0 ? 'empty-category' : '', 'tool-category']">
      <div v-for="(category,index) in showToolCategoryList" :key="category.categoryId"
           :class="[index === 0 ? 'row-first' : '', 'category-item']">
        <div class="category-head"><h4><span class="title"
                                             :title="category.categoryName">{{category.categoryName}}</span>：
        </h4></div>
        <div class="category-body">
          <div :class="[category.showTwoLine ? 'two-line' : '', 'category-label-items']">
            <div :id="category.categoryId" class="g-clearfix">
              <a v-for="label in category.categoryLabels" :key="label.labelId"
                 @click="handleCategoryLabelClick(category,label)" class="label-item">{{label.labelName}}</a>
            </div>
          </div>
          <div class="category-buttons"></div>
        </div>
        <div class="category-foot">
        </div>
      </div>
    </div>
    <div class="tool-hot-search"></div>
    <div class="tool-list">
      <div v-if="toolList.length === 0">
        <empty-tool-list-show @add-tool="handleAddButton('add-tool-dialog')"
                              @add-tool-category="handleAddButton('add-tool-category-dialog')"></empty-tool-list-show>
      </div>
      <div v-else>
        <div class="page-wrapper">
          <el-pagination class="page-pagination"
                         background
                         :hide-on-single-page="true"
                         :current-page="currentPage"
                         :page-size="pageSize"
                         @current-change="handlePageChange"
                         @prev-click="handlePageChange"
                         @next-click="handlePageChange"
                         layout="prev, pager, next"
                         :total="totalTool">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      top="20vh"
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      class="tool-dialog"
    >
      <div slot="title">
        <div v-if="dialogType === 'add-tool-dialog'">
          <span>添加工具</span>
        </div>
        <div v-else><span>添加分类</span></div>
        <span class="show-user-not-longin" v-if="!userLogin">
        <router-link to="/login">
          <el-button type="text">前去登录</el-button>
        </router-link>
        ，未登录时提交的信息会被记录为官方收录
      </span>
      </div>
      <dialog-tool-content v-if="dialogType === 'add-tool-dialog'" @dataUpdate="handleDataUpdate"
                           @dialogWarn="handleDialogWarn"></dialog-tool-content>
      <dialog-tool-category-content @dataUpdate="handleDataUpdate" v-else></dialog-tool-category-content>
      <span slot="footer" class="dialog-footer">
        <div class="dialog-footer-button">
        <el-button @click="handleDialogCancel">取 消</el-button>
          <el-button class="dialog-footer-button-submit" type="primary" @click="handleDialogSubmit"
                     slot="reference">确 定</el-button>
        </div>
        <el-alert
          class="dialog-footer-warn"
          v-show="dialog.warn.isShow"
          :title="dialog.warn.tip"
          :closable="false"
          type="error"></el-alert>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addTool, addToolCategory, listToolCategory, pageListTool} from "../../api/tool";
import EmptyToolListShow from './tool-components/empty-tool-list-show';
import DialogToolContent from './tool-components/dialog-tool-content';
import DialogToolCategoryContent from './tool-components/dialog-tool-category-content';

export default {
  name: "tool",
  data() {
    return {
      toolSearchContent: '',
      toolCategoryList: [],
      toolList: [],
      /**
       * 存储选择的工具分类标签，数据示例 [{categoryId,chooseContent,labelIds:[]}]
       */
      chooseCategoryList: [],
      pageSize: 10,
      currentPage: 1,
      totalTool: 0,
      /**
       * 搜索框输入信息，用于工具列表检索
       */
      toolSearch: '',
      /**
       * 是否有用户登录的标识
       */
      userLogin: false,
      dialogType: 'add-tool-dialog',
      dialogVisible: false,
      dialogTool: {},
      dialogCategory: {},
      dialog: {
        warn: {
          isShow: false,
          tip: ''
        }
      },
      timeout: null
    }
  },
  components: {
    'empty-tool-list-show': EmptyToolListShow,
    'dialog-tool-content': DialogToolContent,
    'dialog-tool-category-content': DialogToolCategoryContent
  },
  methods: {
    fetchToolCategoryList() {
      listToolCategory({}).then(res => {
          if (res.data.data != null) {
            this.toolCategoryList = res.data.data;

            // 工具分类列表更新后，添加Vue.nextTick监听函数，在下次 DOM 更新循环结束之后执行延迟回调
            this.$nextTick(function () {
              for (let index = 0; index < this.toolCategoryList.length; index++) {
                let category = this.toolCategoryList[index];
                const categoryId = category.categoryId;
                let categoryElement = document.getElementById(categoryId);
                if (categoryElement !== null) {
                  let categoryElementOffsetHeight = categoryElement.offsetHeight;
                  category.showTwoLine = categoryElementOffsetHeight > 72;
                  // 通过Vue.set来通知vue对动态数据做了更新
                  this.$set(this.toolCategoryList, index, category);
                }
              }

              // this.$forceUpdate();
            })
          }
        }
      );
    },
    fetchToolList(filterData) {
      pageListTool(filterData).then(res => {
        if (res.data.data != null) {
          this.toolList = res.data.data.list;
        }
      });

    },
    /**
     * 工具分类标签元素点击处理
     * @param category 工具分类
     * @param label 分类标签
     */
    handleCategoryLabelClick(category, label) {
      // 工具类型标签被选择后该类型将隐藏
      for (let index = 0; index < this.toolCategoryList.length; index++) {
        if (category.categoryId === this.toolCategoryList[index].categoryId) {
          category.isShow = false;
          // 通过Vue.set来通知vue对动态数据做了更新
          this.$set(this.toolCategoryList, index, category);
        }
      }
      let chooseContent = category.categoryName + "：" + label.labelName;
      this.chooseCategoryList.push({categoryId: category.categoryId, chooseContent, labelIds: [label.labelId]});
      // 工具分类标签选择后，访问后端查询工具列表
      let categoryLabelMap = new Map();
      this.chooseCategoryList.forEach(chooseCategory => {
        categoryLabelMap.set(chooseCategory.categoryId, chooseCategory.labelIds);
      });
      this.fetchToolList({
        pageNum: 0,
        pageSize: this.pageSize,
        data: {keyword: this.toolSearchContent, toolCategoryLabelIdMap: Object.fromEntries(categoryLabelMap)}
      });
    },
    /**
     * 删除已选择工具分类标签信息处理
     * @param chooseCategory 被删除的工具分类标签信息
     * @param removeIndex 被删除分类标签信息在chooseToolCategory中对应的索引
     */
    removeCategoryLabelChoose(chooseCategory, removeIndex) {
      // 将被删除工具标签信息对应的工具分类恢复显示
      for (let index = 0; index < this.toolCategoryList.length; index++) {
        let category = this.toolCategoryList[index];
        if (chooseCategory.categoryId === category.categoryId && category.isShow === false) {
          category.isShow = true;
          // 通过Vue.set来通知vue对动态数据做了更新
          this.$set(this.toolCategoryList, index, category);
        }
      }
      this.chooseCategoryList.splice(removeIndex, 1);
    },
    handlePageChange(page) {
      this.currentPage = page;
      pageListTool({
        pageNum: 0,
        pageSize: this.pageSize,
        data: {questionId: this.questionId}
      }).then(response => {
        this.answerList = response.data.data.list;
        this.totalAnswer = response.data.data.total;
      })
    },
    /**
     * 添加信息按钮的点击事件处理
     */
    handleAddButton(dialogType) {
      // 隐藏加载状态
      this.dialogType = dialogType;
      this.dialogVisible = true;
    },
    /**
     * 对话框点击确定按钮时处理方法
     */
    handleDialogSubmit() {
      if (this.dialogType === 'add-tool-dialog') {
        if (this.dialogTool.dialogToolName === undefined || this.dialogTool.dialogToolName === '') {
          this.handleDialogWarn('工具名称必须填写！');
          return;
        }
        addTool(
          {
            name: this.dialogTool.dialogToolName,
            description: this.dialogTool.description,
            linkSourceData: this.dialogTool.linkSourceSet
          }
        );
      } else {
        addToolCategory({});
      }
      // 对话框不再显示
      this.dialogVisible = false;
    },
    /**
     * 对话框点击取消按钮时处理方法
     */
    handleDialogCancel() {
      // 对话框不再显示
      this.dialogVisible = false;
    },
    handleDialogClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          console.log(_);
          done();
        })
        .catch(_ => {
          console.log(_);
        });
    },

    //region 对话框内工具分类标签相关方法
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        console.log(_);
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    handleDataUpdate(data) {
      console.log(data)
      if (this.dialogType === 'add-tool-dialog') {
        this.dialogTool = data;
      } else {
        this.dialogCategory = data;
      }
    },
    handleDialogWarn(data) {
      this.dialog.warn.isShow = true;
      this.dialog.warn.tip = data;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.dialog.warn.isShow = false;
        this.dialog.warn.tip = '';
      }, 4000);
    }
    //endregion
  },
  computed: {
    showToolCategoryList() {
      return this.toolCategoryList.filter(function (category) {
        return category.isShow === undefined || category.isShow === true;
      })
    }
  }
  ,
  created() {
    this.fetchToolCategoryList();
    this.fetchToolList({});
  }
}
</script>

<style lang="scss" scoped>
.tool-search {
  margin-top: 50px;
}

.tool-label {
  margin-top: 5px;
}

.choose-category-tag {
  cursor: pointer;
  margin: 4px 5px 0 0;
}

.tool-category {
  margin-top: 5px;
  border: 1px solid #e8e8e8;
}

.category-item {
  position: relative;
  border-top: 1px dashed #dedede;
}


.category-item.row-first {
  border-top: none;
}

.category-head {
  position: absolute;
  left: 11px;
  top: 9px;
  color: #999;
}

.category-body {
  padding: 0 200px 0 212px;
}

.category-label-items {
  height: 36px;
  overflow: hidden;
}

.category-label-items.two-line {
  height: 72px;
}

.label-item {
  float: left;
  margin: 9px 40px 9px 0;
  height: 18px;
  color: #000;
  text-decoration: none;
}

.category-body a {
  cursor: default;
}

.category-body a:hover {
  color: #f40;
}

.tool-list {
  min-height: 500px;
  position: relative;
}

.page-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.page-wrapper::after {
  clear: both;
  display: block;
  content: "";
}

.tool-dialog /deep/ .el-dialog__body {
  padding-top: 10px;
}

.tool-dialog {
  min-width: 500px;
}

.dialog-footer {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.dialog-footer-warn {
  max-width: 70%;
  width: auto;
}

.dialog-footer-button-submit {
  margin-left: 10px;
}
</style>
