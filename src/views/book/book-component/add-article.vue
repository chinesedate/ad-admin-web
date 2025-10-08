<template>
    <div id="book-add-article">
        <quill-editor
                :content="content"
                :options="editorOption"
                @change="onEditorChange($event)"
        />
        <div class="submit-wrapper">
            <el-button class="submit-button" @click="handleAddArticle" type="primary">添加</el-button>
        </div>
    </div>
</template>

<script>
    import {addArticle} from "@/api/article";

    export default {
        name: "add-article",
        props: ['bookId', 'linkLabelId'],
        data() {
            return {
                content: '<h2>I am Example</h2>',
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{'header': 1}, {'header': 2}]
                        ]
                    }
                }
            }
        },
        methods: {
            onEditorChange({quill, html, text}) {
                console.log('editor change!', quill, html, text)
                this.content = html
            },
            handleAddArticle() {
                addArticle({
                    bookId: this.bookId,
                    linkLabelId: this.$store.getters.chooseLabel,
                    content: this.content
                }).then(() => {
                    this.content = '<h2>I am Example</h2>';
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
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
