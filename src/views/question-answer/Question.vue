<template>
    <div class="content-page">
        <div class="question-wrapper">
            <h3>Q:{{question.content}}</h3>
            <p>{{question.excerpt}}</p>
        </div>
        <div class="add-answer">
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="添加你的回答"
                    v-model="answerContent">
            </el-input>
            <div class="answer-submit">
                <el-button class="answer-submit-button" @click="handleAddAnswer(0)" type="primary">提交</el-button>
            </div>

        </div>
        <div class="answer-wrapper">
            <div v-if="showAnswer">
                <div class="answer-item" v-for="(answer, index) of answerList" :key="answer.id">
                    {{answer.content}}
                    <!--显示根回答的回复信息-->
                    <div v-if="answer.responseCount > 0" class="answer-response-wrapper">
                        <div class="answer-response-list" v-for="(response) of answer.responseList" :key="response.id">
                            {{response.content}}
                        </div>
                        <div class="answer-response-more" v-if="answer.responseCount > 2 && answer.responseList.length === 2"
                             @click="handleLoadMoreResponse(index, answer.id, answer.responseList.length)">
                            <p>查看全部{{answer.responseCount}}条回复</p>
                        </div>
                        <div class="answer-response-more" v-else-if="answer.responseCount > answer.responseList.length && answer.responseList.length > 2"
                             @click="handleLoadMoreResponse(index, answer.id, answer.responseList.length)">
                            <p>查看更多回复</p>
                        </div>
                    </div>
                    <div>
                        <el-button @click="handleResponseButton(answer.id)" type="text">回复</el-button>
                    </div>
                    <div class="response-wrapper" :class="[responseId === answer.id ? 'active' : '']">
                        <el-input
                                class="response-input"
                                type="textarea"
                                :rows="3"
                                resize="none"
                                placeholder="请输入内容"
                                v-model="responseContent">
                        </el-input>
                        <el-button class="response-button" @click="handleAddAnswer(1,answer.id,answer.id)"
                                   type="primary">
                            回复
                        </el-button>
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
                                   :total="totalAnswer">
                    </el-pagination>
                </div>
            </div>
            <div v-else>
                <p>暂无评论哦，快来评论一下吧！</p>
            </div>

        </div>
    </div>
</template>

<script>
    import {fetchQuestion} from "@/api/question";
    import {addAnswer, answerList, loadMoreAnswerResponse} from "@/api/answer";

    export default {
        name: "Question",
        props: ['questionId'],
        data() {
            return {
                question: {},
                answerList: [],
                answerContent: '',
                responseId: '',
                pageSize: 10,
                currentPage: 1,
                totalAnswer: 0,
                responseContent: ''
            }
        },
        methods: {
            /**
             * 保存回答
             * @param answerId 对提问的回答时，值默认为'0'，对其他回答的回复，值为对应回答的id
             * @param rootId 该回答对应的根回答id，如果是根回答，该值为'0'
             */
            handleAddAnswer(type, answerId = '0', rootId = '0') {
                let content = type === 0 ? this.answerContent : this.responseContent;
                addAnswer({
                    questionId: this.questionId,
                    content: content,
                    parentId: answerId,
                    rootId: rootId
                });
                this.answerContent = '';
                this.responseContent = '';
                // 再次请求回答列表
                answerList({
                    pageNum: 0,
                    pageSize: this.pageSize,
                    data: {questionId: this.questionId, parentId: '0'}
                }).then(response => {
                    this.answerList = response.data.data.list;
                })
            },
            /**
             * 用于加载更多的根回答回复信息
             * @param answerIndexId 该根回答在展示列表中的索引顺序，用于将该接口返回结果放入正确的位置中
             * @param rootId 根回答id
             */
            handleLoadMoreResponse(answerIndexId, rootId, length) {
                loadMoreAnswerResponse(rootId, {questionId: this.questionId, length: length}).then(
                    response => {
                        console.log(this.answerList[answerIndexId]);
                        this.answerList[answerIndexId].responseList = this.answerList[answerIndexId].responseList.concat(response.data.data);
                    }
                )
            },
            handleResponseButton(answerId) {
                // 校验用户是否登录，未登录时跳转登录页面（token 为undefined或''时，跳转登录页面）
                if (!this.$store.getters.token) {
                    this.$router.push("/login")
                }
                if (this.responseId === answerId) {
                    this.responseId = '';
                } else {
                    this.responseId = answerId;
                }
            },
            handlePageChange(page) {
                this.currentPage = page;
                answerList({
                    pageNum: 0,
                    pageSize: this.pageSize,
                    data: {questionId: this.questionId}
                }).then(response => {
                    this.answerList = response.data.data.list;
                    this.totalAnswer = response.data.data.total;
                })
            }
        },
        computed: {
            showAnswer() {
                return this.answerList.length > 0;
            }
        },
        created() {
            fetchQuestion(this.questionId).then(response => {
                this.question = response.data.data;
            });

            answerList({
                pageNum: 0,
                pageSize: this.pageSize,
                data: {questionId: this.questionId, parentId: '0'}
            }).then(response => {
                this.answerList = response.data.data.list;
            })
        }
    }
</script>

<style scoped>

    .answer-item {
        margin-bottom: 10px;
    }

    .answer-submit {
        margin-top: 10px;
    }

    .answer-submit::after {
        clear: both;
        display: block;
        content: "";
    }

    .answer-submit-button {
        float: right;
    }

    .answer-response-wrapper {
        background-color: #F7F7F7;
    }
    .answer-response-more {
        cursor: default;
    }

    .response-input {

    }

    .response-button {
        position: absolute;
        top: 1px;
        right: 0;
        width: 80px;
        height: 80px;
    }

    .response-wrapper {
        display: none;
        position: relative;
        padding: 6px 93px 6px 16px;
        vertical-align: baseline;
    }

    .response-wrapper.active {
        display: block;
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
