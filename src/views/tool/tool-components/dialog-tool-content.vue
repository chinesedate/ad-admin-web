<template>
  <div class="dialog-content">
    <div class="dialog-tool-name-wrapper">
      <span>名称：</span>
      <el-input v-model="dialogToolName" class="dialog-tool-name" @input="dataUpdate" size="small"
                placeholder="请输入名称"></el-input>
    </div>
    <el-tabs v-model="activeTabName" @tab-click="handleTagClick">
      <el-tab-pane label="分类标签" name="label">
        <div class="tab-wrapper">
          <div>
            <span>选中标签：</span>
            <el-tag v-for="chooseCategory in chooseCategoryLabel" :key="chooseCategory.categoryId"
                    class="choose-category-tag"
                    :disable-transitions="true"
                    size="mini">{{chooseCategory.chooseContent}}
            </el-tag>
          </div>
          <div class="dialog-category-label-tab">
            <ul class="infinite-list" v-infinite-scroll="dialogLoadCategory" :infinite-scroll-disabled="disabled">
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
                         @click="handleCategoryLabelClick(dialogToolCategory,label)"
                         :class="[label.isSelected ? 'is-selected' : 'not-selected', 'dialog-label-item']">{{label.labelName}}
                        <i class="el-tag__close el-icon-close"
                           @click.stop="handleSelectedLabelClose(dialogToolCategory,label)"></i></a>
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
      </el-tab-pane>
      <el-tab-pane label="关联描述" name="description">
        <div class="dialog-tool-description-tab tab-wrapper">
          <div class="dialog-tool-description">
            <span>介绍：</span>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="描述信息"
              v-model="description"
              class="dialog-tool-input"
              resize="none"
            >
            </el-input>
          </div>
          <div class="dialog-tool-link">
            <span class="dialog-tool-link-title">资源：</span>
            <div class="dialog-tool-link-input-wrapper">
              <ul>
                <li v-for="(linkSource, linkSourceIndex) in linkSourceSet" :key="linkSource._id"
                    class="dialog-tool-link-input">
                  <el-input v-model="linkSource.url" size="small"
                            placeholder="请输入关联的资源信息" clearable></el-input>
                  <el-button type="primary" icon="el-icon-close"
                             @click="handleRemoveSourceLink(linkSourceIndex)" size="small"
                             :disabled="linkSourceSet.length === 1"></el-button>
                </li>
              </ul>
              <el-button class="dialog-tool-link-add-more" @click="handleAddSourceLink" size="small" type="primary"
                         :disabled="linkSourceSet.length >=3">
                {{toolLinkAddMoreContent}}
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {pageListToolCategory} from "../../../api/tool";

export default {
  name: "dialog-tool-content",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      hasNext: false,
      categoryList: [],
      description: '',
      loading: false,
      /**
       * 记录关联的网页信息
       */
      linkSourceSet: [{
        url: ''
      }],
      dialogToolName: '',
      /**
       * 被激活的标签页名称
       */
      activeTabName: 'label',
      /**
       * 存储选择的工具分类标签，数据示例 [{categoryId,chooseContent,labelIds:[]}]
       */
      chooseCategoryLabel: [],
      toolLinkAddMoreContent: '添加更多...'
    }
  },
  props: {},
  methods: {
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
    handleTagClick() {

    },
    /**
     * 工具资源链接添加按钮
     */
    handleAddSourceLink() {
      this.linkSourceSet.push({url: ''});
      if (this.linkSourceSet.length >= 3) {
        this.toolLinkAddMoreContent = '最多添加三条资源信息';
      }
    },

    handleRemoveSourceLink(linkIndex) {
      this.linkSourceSet.splice(linkIndex, 1);
      this.toolLinkAddMoreContent = '添加更多...';
    },
    dataUpdate() {
      this.$emit('dataUpdate', {
        dialogToolName: this.dialogToolName,
        description: this.description,
        linkSourceSet: this.linkSourceSet
      })
    },
    /**
     * 工具分类标签点击时间处理
     */
    handleCategoryLabelClick(category, label) {
      // region 首先判断选中的标签是否数量合适（限制最多三个分类，每个分类最多选择五个标签）
      console.log(this.chooseCategoryLabel)
      let isCategorySelected = false;
      for (let chooseIndex = 0; chooseIndex < this.chooseCategoryLabel.length; chooseIndex++) {
        if (this.chooseCategoryLabel[chooseIndex].categoryId === category.categoryId) {
          isCategorySelected = true;
          let chooseCategoryLabelCount = this.chooseCategoryLabel[chooseIndex].labelIds.length;
          if (chooseCategoryLabelCount >= 5) {
            this.$emit('dialogWarn', '每个工具分类最多可以选中5个标签！');
            return;
          }
        }
      }
      let chooseCategoryCount = this.chooseCategoryLabel.length;
      if (chooseCategoryCount >= 3 && !isCategorySelected) {
        this.$emit('dialogWarn', '最多可以选择3个工具分类！');
        return;
      }
      // endregion
      let chooseLabelSet = new Set();
      let chooseLabelIdSet = new Set();
      // 工具类型标签被选择后该类型将变颜色显示
      for (let categoryIndex = 0; categoryIndex < this.categoryList.length; categoryIndex++) {
        if (category.categoryId === this.categoryList[categoryIndex].categoryId) {
          for (let labelIndex = 0; labelIndex < category.categoryLabels.length; labelIndex++) {
            let categoryLabel = category.categoryLabels[labelIndex];
            if (label.labelId === categoryLabel.labelId) {
              categoryLabel.isSelected = true;
            }
            if (categoryLabel.isSelected === true) {
              chooseLabelSet.add(categoryLabel.labelName);
              chooseLabelIdSet.add(categoryLabel.labelId);
            }
          }
          this.categoryList[categoryIndex] = category;
        }
      }
      let chooseContent = category.categoryName + "：" + Array.from(chooseLabelSet).join(",");
      let hasSelectedData = false;
      this.chooseCategoryLabel.forEach(chooseItem => {
        if (chooseItem.categoryId === category.categoryId) {
          chooseItem.chooseContent = chooseContent;
          chooseItem.labelIds = Array.from(chooseLabelIdSet);
          hasSelectedData = true;
        }
      })
      if (!hasSelectedData) {
        this.chooseCategoryLabel.push({
          categoryId: category.categoryId,
          chooseContent,
          labelIds: Array.from(chooseLabelIdSet)
        });
      }
    },
    handleSelectedLabelClose(category, label) {
      let chooseLabelSet = new Set();
      let chooseLabelIdSet = new Set();
      // 工具类型标签被选择后该类型将变颜色显示
      for (let categoryIndex = 0; categoryIndex < this.categoryList.length; categoryIndex++) {
        if (category.categoryId === this.categoryList[categoryIndex].categoryId) {
          for (let labelIndex = 0; labelIndex < category.categoryLabels.length; labelIndex++) {
            let categoryLabel = category.categoryLabels[labelIndex];
            if (label.labelId === categoryLabel.labelId) {
              categoryLabel.isSelected = false;
            }
            if (categoryLabel.isSelected === true) {
              chooseLabelSet.add(categoryLabel.labelName);
              chooseLabelIdSet.add(categoryLabel.labelId);
            }
          }
          this.categoryList[categoryIndex] = category;
        }
      }
      let chooseContent = category.categoryName + "：" + Array.from(chooseLabelSet).join(",");
      let closeCategoryLabelIndex = 0;
      for (let chooseIndex = 0; chooseIndex < this.chooseCategoryLabel.length; chooseIndex++) {
        if (this.chooseCategoryLabel[chooseIndex].categoryId === category.categoryId) {
          closeCategoryLabelIndex = chooseIndex;
          break;
        }
      }
      // 判断当前分类是否还有选中的标签，如果没有删除该分类展示
      if (chooseLabelIdSet.size === 0) {
        this.chooseCategoryLabel.splice(closeCategoryLabelIndex, 1);
      } else {
        this.chooseCategoryLabel[closeCategoryLabelIndex].chooseContent = chooseContent;
        this.chooseCategoryLabel[closeCategoryLabelIndex].labelIds = Array.from(chooseLabelIdSet);
      }
    },
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

.dialog-tool-name-wrapper {
  display: flex;
  align-items: center;
}

.dialog-tool-name {
  width: 60%;
}

/**
 * 对话框内的工具分类信息
 */
.dialog-category-wrapper {
  margin-top: 20px;
}

.tab-wrapper {
  height: 250px;
}

.dialog-category-label-tab {
  height: 230px;
  overflow: auto;
}

.infinite-list li {
  margin-bottom: 5px;
}

.dialog-category-head {
  position: absolute;
  left: 11px;
  top: 9px;
  color: #999;
}

.choose-category-tag {
  margin-right: 10px;
}

.dialog-category-body {
  padding: 0 80px 0 80px;
}

.dialog-category-body a {
  cursor: default;
}

//.dialog-category-body a:hover {
//  color: #f40;
//}

.dialog-category-item {
  position: relative;
}

.dialog-category-label-items {
  min-height: 36px;
}

.dialog-label-item {
  float: left;
  padding: 9px 10px;
  height: 18px;
  line-height: 18px;
  color: #000;
  text-decoration: none;
  margin-right: 10px;
  border-radius: 4px;
  position: relative;
}

.dialog-category-body a.dialog-label-item.not-selected:hover {
  color: #f40;
}

.dialog-category-body a.dialog-label-item i {
  display: none;
}

.dialog-label-item.is-selected {
  background-color: rgb(217, 236, 255);
  color: #f40;
}

.dialog-category-body a.dialog-label-item.is-selected i {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;

}

.dialog-category-body a.dialog-label-item.is-selected i:hover {
  color: #FFF;
  background-color: #409eff;
}

.dialog-category-tip {
  text-align: center;
  padding: 10px 0;
}

.dialog-tool-description {
  display: flex;
  align-items: center;
}

.dialog-tool-input {
  width: 80%;
}

.dialog-tool-link {
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
}

.dialog-tool-link-title {
  margin-top: 10px;
}

.dialog-tool-link-input-wrapper {
  width: 80%;
}

.dialog-tool-link-input {
  margin-bottom: 10px;
  display: flex;
  align-items: center;

}

.dialog-tool-link-input /deep/ .el-input {
  width: 70%;
}

.dialog-tool-link-input button {
  margin-left: 10px;
}

.dialog-tool-link-add-more {
  margin-top: 10px;
}

</style>