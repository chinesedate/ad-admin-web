<template>
  <div class="audit-qa-tab-wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="audit-qa-tab-list-content">
      <div class="audit-qa-tab-list">
        <div class="audit-qa-tab-list-header">名称来源列表</div>
        <div class="audit-qa-tab-select">
          <div class="audit-name-source-type">
            <div class="audit-name-source-type-content">问答类型：</div>
            <div>
              <el-radio-group v-model="sourceType" @input="listNameSourceByType">
                <el-radio label="book">书籍</el-radio>
                <el-radio label="tv">电视剧</el-radio>
                <el-radio label="movie">电影</el-radio>
                <el-radio label="show">综艺</el-radio>
                <el-radio label="history">历史名人</el-radio>
                <el-radio label="others">其他</el-radio>
                <el-radio label="suggest">推荐</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="audit-qa-tab-input">
            <el-input
              class="qa-tab-list-search inline-input"
              v-model="nameSourceKeyword"
              placeholder="请输入内容"
              :clearable="true"
              @change="listNameSourceByType"
              @input="listNameSourceByType">
              <i class="el-icon-search el-input__icon" slot="suffix" @click="listNameSourceByType"></i>
            </el-input>
          </div>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <!--          <ul class="audit-qa-tab-title-list" v-infinite-scroll="load">-->
          <!--            <li class="audit-qa-tab-title-wrapper" v-for="nameSource in nameSourceList" :key="nameSource.sourceId"-->
          <!--                @click="handleNameSourceClick(nameSource)">-->
          <!--              <div v-if="nameSource.sourceName" class="qa-tab-title">-->
          <!--                <el-switch-->
          <!--                  :value="nameSource.suggestStatus !== undefined && nameSource.suggestStatus"-->
          <!--                  @click.native.stop-->
          <!--                  @change="changeSourceSuggestStatus(nameSource)"-->
          <!--                  active-color="#13ce66"-->
          <!--                  inactive-color="#ff4949">-->
          <!--                </el-switch>-->
          <!--                <span>{{nameSource.sourceName}}</span>-->
          <!--              </div>-->
          <!--              <div v-else class="qa-tab-title"><span>当前回复未添加标题</span></div>-->
          <!--            </li>-->
          <!--          </ul>-->
          <el-table
            :data="nameSourceList"
            highlight-current-row
            @current-change="handleNameSourceClick"
            style="width: 100%">
            <el-table-column
              prop="sourceName"
              label="来源"
              width="180">
            </el-table-column>
            <el-table-column
              prop="activeStatus"
              label="激活"
              width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.activeStatus"
                  @click.native.stop
                  @change="changeSourceActiveStatus($event,scope.row)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="suggestStatus"
              label="推荐"
              width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.suggestStatus"
                  @click.native.stop
                  @change="changeSourceSuggestStatus($event,scope.row)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="sortIndex"
              label="排序"
              width="80">
              <template slot-scope="scope">
                <el-popover
                  placement="right"
                  width="300"
                  :ref="`popover-${scope.$index}`"
                  @hide="handleNameSourceSortHide">
                  <div style="display:flex;text-align: right; margin: 10px">
                    <el-button type="primary" size="mini"
                               @click="handleNameSourceSort(scope, sortNameSourceInfo.baseId)">重排
                    </el-button>
                    <el-select v-model="sortNameSourceInfo.baseId" clearable filterable placeholder="请选择"
                               style="margin-left: 10px">
                      <el-option
                        v-for="item in sortNameSourceInfo.sortNameSourceList"
                        :key="item.sourceId"
                        :label="item.sourceName"
                        :value="item.sourceId"
                        :disabled="item.sourceId === scope.row.sourceId">
                      </el-option>
                    </el-select>
                  </div>
                  <el-button slot="reference" type="text" size="small"
                             @click.native.stop="activeNameSourceSort(scope.row)">选择
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              hide-on-single-page
              layout="prev, pager, next"
              :current-page="currentPage"
              @current-change="handleNameSourcePageChange"
              @prev-click="handleNameSourcePageChange"
              @next-click="handleNameSourcePageChange"
              :total="total">
            </el-pagination>
          </div>
        </div>
        <div class="add-name-source-wrapper">
          <el-form :model="newNameSourceForm" ref="newNameSourceForm" label-width="50px" class="demo-ruleForm"
                   label-position="top">
            <el-form-item
              label="名称来源"
              prop="sourceName"
              :rules="[ { required: true, message: '请输入名称来源'}]"
            >
              <el-input v-model.number="newNameSourceForm.sourceName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="来源描述"
              prop="desc"
              :rules="[ { required: false, message: '请输入来源描述'}]"
            >
              <el-input v-model.number="newNameSourceForm.desc" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('newNameSourceForm')">提交</el-button>
              <el-button @click="resetForm('newNameSourceForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="audit-qa-tab">
        <div class="audit-qa-tab-header">名称来源对应信息</div>
        <div class="name-source-content-item-wrapper">
          <div class="name-source-content-info">
            <span class="name-source-content-item">{{selectNameSource.sourceName}}</span>
          </div>
          <div>
            <el-button class="name-source-content-item" type="primary" @click="handleDialogActive(0)" slot="reference"
                       plain>
              编辑
            </el-button>
            <el-button class="name-source-content-item" type="primary" @click="handleDialogActive(1)" slot="reference"
                       plain>
              添加来源标签
            </el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handleNameSourceRemove">
              <el-button class="name-source-content-item" type="primary" slot="reference" plain>删除</el-button>
            </el-popconfirm>
          </div>
        </div>
        <div class="name-source-tab-list-wrapper">
          <ul>
            <li class="name-source-tab" v-for="nameSourceTab in nameSourceTabPage.nameSourceTabList"
                :key="nameSourceTab.tabId">
              <div class="name-source-tab-title">
                <div class="name-source-tab-title-name">{{nameSourceTab.tabName}}</div>
                <div>
                  <el-popconfirm title="确定删除吗？" @confirm="handleNameSourceTabRemove(nameSourceTab)">
                    <el-button class="name-source-content-item" size="small" slot="reference">删除</el-button>
                  </el-popconfirm>
                  <el-button class="name-source-content-item" size="small" @click="handleDialogActive(2)"
                             slot="reference">编辑
                  </el-button>
                  <el-button class="name-source-content-item" size="small" @click="handleAddNameClick(nameSourceTab)"
                             slot="reference">添加名称
                  </el-button>

                </div>
              </div>
              <div class="name-source-tab-name-list">
                <div v-if="nameSourceTab.nameList !== null">
                  <el-tag class="name-source-tab-name-list-tag"
                          v-for="nameItem in nameSourceTab.nameList" :key="nameItem.nameId"
                          @close="handleNameRemove(nameSourceTab, nameItem)"
                          closable>
                    {{nameItem.lastName}}{{nameItem.name}}
                  </el-tag>
                </div>
              </div>
            </li>
          </ul>
          <div class="block">
            <el-pagination
              layout="prev, pager, next"
              hide-on-single-page
              :current-page="nameSourceTabPage.currentPage"
              @current-change="handleNameSourceTabPageChange"
              @prev-click="handleNameSourceTabPageChange"
              @next-click="handleNameSourceTabPageChange"
              :total="nameSourceTabPage.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" class="name-page-dialog">
      <el-form v-if="dialogType === 0" :model="modifyNameSourceForm" ref="modifyNameSourceForm">
        <el-form-item label="名称来源">
          <el-input v-model="modifyNameSourceForm.sourceName" placeholder="输入名称来源"></el-input>
        </el-form-item>
        <el-form-item label="来源描述">
          <el-input v-model="modifyNameSourceForm.desc" placeholder="输入来源描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyNameSource">更新</el-button>
        </el-form-item>
      </el-form>
      <el-form v-else-if="dialogType === 1" :model="newNameSourceTabForm" ref="newNameSourceTabForm">
        <el-form-item label="标签名称" prop="tabName">
          <el-input v-model="newNameSourceTabForm.tabName" placeholder="输入标签名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addNameSourceTab">添加</el-button>
        </el-form-item>
      </el-form>
      <el-form v-else-if="dialogType === 2" :model="modifyNameSourceTabForm" ref="modifyNameSourceTabForm">
        <el-form-item label="标签名称" prop="tabName">
          <el-input v-model="newNameForm.tabName" placeholder="输入标签名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addNameSourceTab">更新</el-button>
        </el-form-item>
      </el-form>
      <el-form v-else-if="dialogType === 3" :model="newNameForm" ref="newNameForm">
        <el-form-item label="姓氏" prop="lastName">
          <el-input v-model="newNameForm.lastName" placeholder="输入姓氏"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="newNameForm.name" placeholder="输入名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addName">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    dataSort,
    listNameInfo,
    listNameSource,
    listNameSourceTab,
    modifyNameSource,
    modifyNameSourceActiveStatus,
    modifyNameSourceSuggestStatus,
    newName,
    newNameSource,
    newNameSourceTab,
    removeName,
    removeNameSource,
    removeNameSourceTab,
    listSuggestNameSource
  } from "../../api/name-manage/name";

  export default {
    name: "name-manage",
    data() {
      return {
        pageSize: 10,
        total: 0,
        hasNext: false,
        // 内容类型 book 书籍  tv 电视剧  movie 电影  show 综艺  history 历史名人  others 其它
        sourceType: 'book',
        currentPage: 1,
        /**
         * 名称来源排序相关信息
         */
        sortNameSourceInfo: {
          sourceId: 0,
          baseId: '',
          /**
           * 排序用筛选的名称来源列表
           */
          sortNameSourceList: [],
        },
        /**
         * 推荐名称来源列表
         */
        suggestNameSourceList: [],
        /**
         * 名称来源列表
         */
        nameSourceList: [],
        /**
         * 名称来源搜索词
         */
        nameSourceKeyword: '',
        /**
         * 名称来源标签分页西悉尼
         */
        nameSourceTabPage: {
          /**
           * 名称列表
           */
          nameSourceTabList: [],
          currentPage: 1,
          pageSize: 100,
          total: 0
        },
        /**
         * 名称搜索词
         */
        nameKeyword: '',
        /**
         * 当前正进行审核的标签页信息
         */
        auditQaTab: {},
        qaTabSearch: '',
        loading: false,
        /**
         * 当前选中的名称来源
         */
        selectNameSource: {},
        /**
         * 新增名称来源信息
         */
        newNameSourceForm: {
          sourceName: '',
          desc: ''
        },
        /**
         * 编辑名称来源信息表单
         */
        modifyNameSourceForm: {},
        /**
         * 新增名称来源标签表单
         */
        newNameSourceTabForm: {
          tabName: ''
        },
        /**
         * 编辑名称来源标签信息表单
         */
        modifyNameSourceTabForm: {
          tabName: ''
        },
        /**
         * 新增名称表单
         */
        newNameForm: {
          sourceId: 0,
          tabId: 0,
          lastName: '',
          name: ''
        },
        /**
         * 对话框类型 0 编辑名称来源  1 添加名称来源标签  2 编辑来源标签  3 添加名称
         */
        dialogType: 0,
        dialogTableVisible: false
      }
    },
    methods: {
      /**
       * 查询所有激活状态的名称来源列表
       */
      activeNameSourceSort(nameSource) {
        this.sortNameSourceInfo.sourceId = nameSource.sourceId;
        listNameSource({
            pageNum: 1,
            pageSize: 0,
            data: {sourceType: this.sourceType}
          }
        ).then(res => {
            if (res.data.data != null) {
              this.sortNameSourceInfo.sortNameSourceList = res.data.data.list;
            }
          }
        );
      },
      /**
       * 处理名称来源排序
       * @param scope 当前行信息
       * @param baseId 排序基准id
       */
      handleNameSourceSort(scope, baseId) {
        // 将弹出框隐藏
        scope._self.$refs[`popover-${scope.$index}`].doClose();
        let nameSource = scope.row;
        // dataType 数据类型 0 名称来源  1 名称来源标签  2 名称  3 推荐来源
        dataSort({dataType: 0, moveId: nameSource.sourceId, baseId}).then(() => {
          // 重排执行完成后，重新刷新当前名称来源列表
          this.handleNameSourcePageChange(1);
        });

      },
      /**
       * 名称来源排序弹出框隐藏处理
       */
      handleNameSourceSortHide() {
        this.sortNameSourceInfo.baseId = '';
        this.sortNameSourceInfo.sortNameSourceList = [];
      },
      /**
       * 跟新名称来源的激活状态
       * @param activeStatus 推荐状态 0 不激活  1 激活
       * @param nameSource 当前名称来源信息
       */
      changeSourceActiveStatus(activeStatus, nameSource) {
        modifyNameSourceActiveStatus({sourceId: nameSource.sourceId, activeStatus}).then(() => {
          nameSource.activeStatus = activeStatus;
        });
      },
      /**
       * 跟新名称来源的推荐状态
       * @param suggestStatus 推荐状态 0 不推荐  1 推荐
       * @param nameSource 当前名称来源信息
       */
      changeSourceSuggestStatus(suggestStatus, nameSource) {
        modifyNameSourceSuggestStatus({sourceId: nameSource.sourceId, suggestStatus}).then(() => {
          nameSource.suggestStatus = suggestStatus;
        });
      },
      /**
       * 激活对话框
       * @param activeDialogType 对话框类型 0 编辑名称来源  1 添加名称来源标签  2 编辑来源标签  3 添加名称
       */
      handleDialogActive(activeDialogType) {
        this.dialogType = activeDialogType;
        if (activeDialogType === 0) {
          this.modifyNameSourceForm = this.selectNameSource;
        }
        this.dialogTableVisible = true;
      },
      /**
       * 名称来源标签对应的添加名称按钮点击事件处理
       * @param nameSourceTab 名称来源标签信息
       */
      handleAddNameClick(nameSourceTab) {
        this.newNameForm.sourceId = this.selectNameSource.sourceId;
        this.newNameForm.tabId = nameSourceTab.tabId;
        this.handleDialogActive(3);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 添加资源名称
            newNameSource(
              {sourceType: this.sourceType, sourceName: this.newNameSourceForm.sourceName}
            ).then(() => {
              // 重置表单
              this.resetForm('newNameSourceForm');
              // 刷新列表
              this.handleNameSourcePageChange(1);
            });
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      listNameSourceByType() {
        // sourceType为suggest，
        if (this.sourceType === 'suggest') {
          listSuggestNameSource({
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            data: {nameKeyword: this.nameSourceKeyword}
          }).then(res => {
              if (res.data.data != null) {
                this.suggestNameSourceList = res.data.data.list;
                this.total = res.data.data.total;
                this.hasNext = res.data.data.hasNext;
                if (this.suggestNameSourceList.length > 0) {
                  this.handleNameSourceClick(this.suggestNameSourceList[0]);
                }
              }
            }
          );
        } else {
          listNameSource({
              pageNum: this.currentPage,
              pageSize: this.pageSize,
              data: {sourceType: this.sourceType, nameKeyword: this.nameSourceKeyword}
            }
          ).then(res => {
              if (res.data.data != null) {
                this.nameSourceList = res.data.data.list;
                this.total = res.data.data.total;
                this.hasNext = res.data.data.hasNext;
                if (this.nameSourceList.length > 0) {
                  this.handleNameSourceClick(this.nameSourceList[0]);
                  // this.selectNameSource = this.nameSourceList[0];
                  // this.fetchAuditQaInfo(this.auditQaInfoList[0].id);
                }
              }
            }
          );
        }
      },
      /**
       * 处理名称来源分页切页操作
       * @param page 页码
       */
      handleNameSourcePageChange(page) {
        this.currentPage = page;
        this.listNameSourceByType();
      },
      /**
       * 查询名称来源对应的名称列表
       */
      handleNameSourceClick(nameSource) {
        this.selectNameSource = nameSource;
        // 分页查询该资源对应的名称来源标签列表
        this.pageListNameSourceTab(1);
      },
      /**
       * 分页查询名称来源标签列表
       */
      pageListNameSourceTab(page) {
        listNameSourceTab({
          pageNum: page,
          pageSize: this.pageSize,
          data: {sourceId: this.selectNameSource.sourceId}
        }).then(res => {
            if (res.data.data != null) {
              this.nameSourceTabPage.nameSourceTabList = res.data.data.list;
              this.nameSourceTabPage.total = res.data.data.total;
              this.nameSourceTabPage.hasNext = res.data.data.hasNext;
            }
          }
        );
      },
      /**
       * 查询名称列表
       * @param tabId 名称来源标签信息id
       */
      listName(tabId) {
        let that = this;
        listNameInfo({tabId}).then((res) => {
          // 工具类型标签被选择后该类型将隐藏
          for (let index = 0; index < that.nameSourceTabPage.nameSourceTabList.length; index++) {
            let nameSourceTab = that.nameSourceTabPage.nameSourceTabList[index];
            if (tabId === nameSourceTab.tabId) {
              nameSourceTab.nameList = res.data.data;
              // 通过Vue.set来通知vue对动态数据做了更新
              this.$set(that.nameSourceTabPage.nameSourceTabList, index, nameSourceTab);
            }
          }
        });
      },
      /**
       * 处理名称来源标签分页切页操作
       * @param page 页码
       */
      handleNameSourceTabPageChange(page) {
        this.nameSourceTabPage.currentPage = page;
        // 分页查询该资源对应的名称来源标签列表
        this.pageListNameSourceTab(page);
      },
      /**
       * 删除名称来源信息
       */
      handleNameSourceRemove() {
        // 删除名称来源信息
        removeNameSource(this.selectNameSource.sourceId).then(() => {
          // 刷新列表
          this.handleNameSourcePageChange(1);
        });
      },
      /**
       * 更新名称来源信息
       */
      modifyNameSource() {
        modifyNameSource(this.modifyNameSourceForm).then(() => {
          // // 分页查询该资源对应的名称来源标签列表
          this.pageListNameSourceTab(1);
        });
      },
      /**
       * 添加名称来源标签
       */
      addNameSourceTab() {
        let that = this;
        newNameSourceTab({
          sourceId: this.selectNameSource.sourceId,
          tabName: this.newNameSourceTabForm.tabName
        }).then(() => {
          // 重置表单
          that.resetForm('newNameSourceTabForm');
          that.dialogTableVisible = false;
          // 刷新名称来源标签列表
          that.pageListNameSourceTab(1);
        });
      },
      /**
       * 添加名称
       */
      addName() {
        let that = this;
        newName({
          sourceId: this.newNameForm.sourceId,
          tabId: this.newNameForm.tabId,
          name: this.newNameForm.name,
          lastName: this.newNameForm.lastName
        }).then(() => {
          // 重置表单
          that.resetForm('newNameForm');
          that.dialogTableVisible = false;
          // 刷新名称列表
          that.listName(this.newNameForm.tabId);
        });
      },
      /**
       * 删除名称
       * @param nameInfo 名称信息
       */
      handleNameRemove(nameSourceTab, nameInfo) {
        removeName(nameInfo.nameId).then(() => {
          nameSourceTab.nameList.splice(nameSourceTab.nameList.indexOf(nameInfo), 1);

          // 工具类型标签被选择后该类型将隐藏
          for (let index = 0; index < this.nameSourceTabPage.nameSourceTabList.length; index++) {
            let nameSourceTabItem = this.nameSourceTabPage.nameSourceTabList[index];
            if (nameSourceTabItem.tabId === nameSourceTab.tabId) {
              // 通过Vue.set来通知vue对动态数据做了更新
              this.$set(this.nameSourceTabPage.nameSourceTabList, index, nameSourceTab);
            }
          }
        });
      },
      /**
       * 删除名称来源标签信息
       */
      handleNameSourceTabRemove(nameSourceTab) {
        // 删除名称来源信息
        removeNameSourceTab(nameSourceTab.tabId).then(() => {
          // 刷新名称来源标签列表
          this.pageListNameSourceTab(1);
        });
      },
      load() {
        this.loading = true
        setTimeout(() => {
          this.count += 2
          this.loading = false
        }, 2000)
      }
    },
    computed: {
      noMore() {
        return this.count >= 20
      },
      disabled() {
        return this.loading || this.noMore
      },
      dialogTitle() {
        if (this.dialogType === 0) {
          return '编辑名称来源';
        } else if (this.dialogType === 1) {
          return '添加名称来源标签';
        } else if (this.dialogType === 3) {
          return '添加名称';
        }
        return '';
      }
    },
    created() {
      // this.listAuditQaTab();
      this.listNameSourceByType();
    }
  }
</script>

<style lang="scss" scoped>
  .audit-qa-tab-wrapper {

  }

  .audit-qa-tab-list-content {
    padding-top: 20px;
    display: flex;
  }

  .audit-qa-tab-list {
    width: 550px;
  }

  .audit-name-source-type {
    margin-bottom: 15px;

    .audit-name-source-type-content {
      margin-bottom: 15px;
    }
  }

  .audit-qa-tab-list-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .audit-qa-tab-input {
    //margin-top: 20px;

    .qa-tab-list-search {
      width: 400px;
    }
  }


  .audit-qa-tab-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 40px;
    color: #212121;
    word-break: break-word;
    padding-bottom: 20px;
  }

  .name-source-content-item-wrapper {
    .name-source-content-info {
      margin-bottom: 20px;
    }

    .name-source-content-item {
      display: inline-block;
      margin-right: 20px;
    }
  }

  .audit-qa-tab-button {
    padding-top: 10px;
  }

  .audit-qa-tab-title-list {
    padding: 20px 0 5px;
    height: 300px;

    .audit-qa-tab-title-wrapper {
      margin-bottom: 15px;
      cursor: pointer;
    }
  }

  .name-source-tab-list-wrapper {
    padding: 25px 0;
    width: 1000px;
    height: 500px;
    overflow: auto;

    .name-source-tab {
      padding: 15px 0;

      .name-source-tab-title {
        display: flex;
        align-items: center;
      }

      .name-source-content-item {
        margin-right: 20px;
      }

      .name-source-tab-title-name {
        margin-right: 30px;
      }

      .name-source-tab-name-list {
        padding-top: 10px;
        display: flex;

        .name-source-tab-name-list-tag {
          margin-right: 10px;
        }
      }
    }

  }

  .page-wrapper {
    //position: absolute;
    //bottom: 0;
    //width: 100%;
    //display: flex;
    //justify-content: center;
  }

  .audit-qa {
    height: 50px;
    padding-bottom: 10px;
    cursor: default;
  }

  .qa-content {
    cursor: pointer;
  }

  .audit-qa-tab {
    margin-left: 20px;
    max-width: 600px;
  }

  .audit-qa-tab-content {
    margin-top: 20px;
  }

  .add-name-source-wrapper {
    margin-top: 20px;
    width: 300px;
  }

  .name-page-dialog /deep/ .el-dialog {
    width: 40% !important;
  }
</style>
