<template>
    <div class="content-page">
        <el-row class="tac">
            <el-col :span="4">
                <h5>默认颜色</h5>
                <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose">
                    <el-menu-item index="1">
                        <i class="el-icon-reading"></i>
                        <span slot="title">推荐</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">收藏</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <i class="el-icon-document"></i>
                        <span slot="title">历史</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="16">
                <div class="question-wrapper">
                    <div class="question-search">
                        <div class="ask-question">
                            <el-button class="ask-question-button" @click="handleAskQuestion" type="primary">添加问题
                            </el-button>
                        </div>
                        <div class="advanced-search">
                            <el-button class="advanced-search-button" type="text" @click="handleAdvancedContent">高级搜索
                            </el-button>
                            <el-card class="box-card">
                                <div v-if="showAdvancedContent">
                                    <div v-for="o in 4" :key="o" class="text item">
                                        {{'列表内容 ' + o }}
                                    </div>
                                </div>
                            </el-card>
                            <el-input placeholder="请输入内容" v-model="searchContent" class="input-with-select">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </div>
                    </div>
                    <div class="question-list">
                        <div class="question-item" v-for="(item) in questionList" :key="item.id">
                            <router-link :to="'/qa/question/' + item.id"> <h3>Q:{{item.content}}</h3></router-link>

                            <div class="question-excerpt">
                                {{item.excerpt}}
                            </div>
                            <div class="question-tag"></div>
                            <div class="question-create">
                            </div>
                        </div>
                    </div>
                    <div class="page-wrapper">
                        <el-pagination class="page-pagination"
                                       background
                                       :current-page="currentPage"
                                       :page-size="pageSize"
                                       @current-change="handlePageChange"
                                       @prev-click="handlePageChange"
                                       @next-click="handlePageChange"
                                       layout="prev, pager, next"
                                       :total="totalQuestion">
                        </el-pagination>
                    </div>
                </div>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {questionList} from "@/api/question";

    export default {
        name: "index",
        data() {
            return {
                showAdvancedContent: false,
                searchContent: '',
                totalQuestion: 0,
                pageSize: 10,
                currentPage: 1,
                questionList: []
            };
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleAdvancedContent() {
                this.showAdvancedContent = !this.showAdvancedContent;
            },
            handleAskQuestion() {
                this.$router.push({path: `/qa/ask`});
            },
            handlePageChange(page) {
                this.currentPage = page;
                questionList({pageNum: page - 1, pageSize: this.pageSize}).then(res => {
                    this.totalQuestion = res.data.data.total;
                    this.questionList = res.data.data.list;
                });
            }
        },
        created() {
            this.handlePageChange(this.currentPage);
        }
    }
</script>

<style lang="scss" scoped>
    .question-wrapper{
        border-left: solid 1px #ddd;
    }
    .question-search {
        display: block;
        margin-top: 30px;
        margin-left: 10px;
    }

    .ask-question::after {
        clear: both;
        display: block;
        content: "";
    }

    .ask-question-button {
        float: right;
    }

    .advanced-search {
        margin-top: 10px;
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .el-menu{
        border-right: none;
    }

    .advanced-search-button {
        margin-left: 10px;
    }

    .box-card /deep/ .el-card__body {
        padding: 0;
    }

    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

    .question-list {
        min-height: 500px;
        /*border-left: solid 1px #ddd;*/
    }

    .question-item{
        height: 130px;
        padding: 12px 8px;
    }

    .page-wrapper::after {
        clear: both;
        display: block;
        content: "";
    }

    .page-pagination {
        float: right;
    }

</style>
