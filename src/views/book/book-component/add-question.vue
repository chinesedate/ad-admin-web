<template>
    <div id="book-ask-question">
        <el-input
                class="question-content"
                placeholder="请输入问题"
                v-model="content">
        </el-input>
        <el-input
                class="question-excerpt"
                type="textarea"
                :rows="3"
                placeholder="添加描述"
                v-model="excerpt">
        </el-input>
        <div class="submit-wrapper">
            <el-button class="submit-button" @click="handleAskQuestion" type="primary">添加</el-button>
        </div>
    </div>
</template>

<script>
    import {askQuestion} from "@/api/question";

    export default {
        name: "add-question",
        props: ['bookId', 'linkLabelId'],
        data() {
            return {
                content: '',
                excerpt: '',
                // dynamicTags: ['标签一', '标签二', '标签三'],
                inputVisible: false,
                inputValue: ''
            }
        },
        methods: {
            handleAskQuestion() {
                askQuestion(
                    {
                        bookId: this.bookId,
                        linkLabelId: this.$store.getters.chooseLabel,
                        content: this.content,
                        excerpt: this.excerpt,
                        tagList: this.dynamicTags
                    });
            },

            // handleClose(tag) {
            //     this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            // },

            showInput() {
                this.inputVisible = true;
                // eslint-disable-next-line no-unused-vars
                this.$nextTick(_ => {
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    #book-ask-question {
        margin-top: 30px;
    }

    .question-excerpt {
        margin-top: 20px;
    }

    .submit-wrapper {
        margin-top: 10px;
    }

    .submit-wrapper::after {
        clear: both;
        display: block;
        content: "";
    }

    .submit-button {
        float: right;
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
</style>
