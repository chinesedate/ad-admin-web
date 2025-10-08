<template>
    <div class="content-page">
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
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        <div class="submit-wrapper">
            <el-button class="submit-button" @click="handleAskQuestion" type="primary">添加</el-button>
        </div>
    </div>
</template>

<script>
    import {askQuestion} from "@/api/question";

    export default {
        name: "AskQuestion",
        data() {
            return {
                content: '',
                excerpt: '',
                dynamicTags: ['标签一', '标签二', '标签三'],
                inputVisible: false,
                inputValue: ''
            }
        },
        methods: {
            handleAskQuestion() {
                askQuestion({content: this.content, excerpt: this.excerpt, tagList: this.dynamicTags});
            },

            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

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

<style scoped>

    .content-page {
        margin-top: 30px;
    }

    .question-excerpt {
        margin-top: 20px;
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
