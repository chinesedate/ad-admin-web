<template>
    <div class="book-hub-view">
        <ul v-if="book.image" class="book-introduction-view">
            <li class="book-image-view">
                <img class="book-image" :src="book.image.src" :alt="book.image.alt">
            </li>
            <li class="book-description-view">
                <div class="book-title">
                    书名：
                    <p>{{book.title}}</p>
                </div>
                <div class="book-author">
                    作者：
                    <p>{{book.author}}</p>
                </div>
                <div class="book-synopsis">
                    简介：
                    <p>{{book.synopsis}}</p>
                </div>
            </li>
        </ul>
        <ul class="book-content-view">
        <li class="book-title-tree">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </li>
        <li class="book-title-relate"></li>
        </ul>
    </div>
</template>

<script>
    import {fetchBook} from "@/api/book";

    export default {
        name: "BookHub",
        props: ['bookId'],
        data() {
            return {
                book: {},
                data: [
                    {
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        methods:{
            handleNodeClick(){

            }
        },
        created() {
            fetchBook(this.bookId).then(res => {
                this.book = res.data.data;
                console.log(this.book.image.src);
            });
        }
    }
</script>

<style scoped>
    ul,li {
        list-style-type: none;
    }
    .book-introduction-view li {
        display: inline-block;
        height: 300px;
        vertical-align: top;
    }

    .book-image {
        width: 200px;
        height: 300px;
    }

    .book-description-view {
        margin-left: 50px;
    }

    .book-description-view div {
        width: 100px;
        height: 30px;
        margin: 15px 0;
        border: solid 1px #ddd;
    }
    .book-content-view li{
        display: inline-block;
        vertical-align: top;
        border: solid 1px #ddd;
    }
    .book-title-tree{
        width: 200px;
    }
</style>
