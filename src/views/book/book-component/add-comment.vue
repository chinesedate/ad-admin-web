<template>
    <div id="book-add-comment">
        <div>
            <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="添加短评"
                    v-model="comment">
            </el-input>
            <div class="submit-wrapper">
                <el-button class="submit-button" @click="handleAddComment" type="primary">添加</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {addComment} from "@/api/comment";

    export default {
        name: "add-comment",
        props: ['bookId', 'linkLabelId'],
        data() {
            return {
                comment: ''
            }
        },
        methods: {
            /**
             * 添加短评
             */
            handleAddComment() {
                // 校验用户是否登录，未登录时跳转登录页面（token 为undefined或''时，跳转登录页面）
                if (!this.$store.getters.token) {
                    this.$router.push("/login")
                } else {
                    addComment({
                        bookId: this.bookId,
                        linkLabelId: this.$store.getters.chooseLabel,
                        comment: this.comment
                    }).then(() => {
                            this.comment = '';
                        }
                    );
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #book-add-comment {
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
</style>
