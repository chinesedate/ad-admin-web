<template>
    <div class="content-page">
        <ul class="category-wrapper">
            <!--图书分类-->
            <li class="category-book-view">
                <ul>
                    <li class="category-li" v-for="(category,index) of bookCategory" v-bind:key="index">
                        <ul>
                            <li class="item-li" v-for="item of category.itemList" v-bind:key="item.id">
                                <router-link :to="'/book/screen/' + item.content">{{item.content}}</router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="carousel-display-view">
                <!--图书走马灯-->
                <div class="book-carousel-view">
                    <el-carousel trigger="click">
                        <el-carousel-item v-for="(image,index) in bookImageCarousel" :key="index">
                            <img v-bind:src="image.src" v-bind:alt="image.alt">
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="book-display-view">
                    <div class="book-display-item" v-for="(image,index) in bookImageDisplay" :key="index">
                        <img v-bind:src="image.src" v-bind:alt="image.alt">
                    </div>
                </div>
            </li>
            <li class="handle-book-view">
                <!--利用图谱，根据看书历史，推荐下一本书-->
                <div class="analyze-book-view">
                    <div class="analyze-book-input">
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
                    </div>
                    <el-button>推荐下一本书</el-button>
                </div>
                <div class="handle-button-view">
                    <div class="handle-item" @click="handleItemClick('/book/add')">
                        <i class="el-icon-edit"></i>
                        <p>添加图书</p>
                    </div>
                </div>
            </li>

        </ul>
        <!--热门推荐-->
        <div>
            <h3>热门推荐</h3>
            <div class="recommend-book-view">
                <div class="recommend-book-item" v-for="(book,index) of recommendBook" :key="index">
                    <img :src="book.image.src" :alt="book.image.alt"  @click="handleBookClick(book.id)">
                    <p>{{book.description}}</p>
                </div>
            </div>
        </div>

        <!--经典好书-->
        <div>
            <h3>经典好书</h3>
            <div class="classic-book-view">
                <div class="classic-book-item" v-for="(book,index) of classicBook" :key="index">
                    <img :src="book.image.src" :alt="book.image.alt">
                    <p>{{book.description}}</p>
                </div>
            </div>
        </div>
        <!--新书上架-->
        <div>
            <h3>新书上架</h3>
            <div class="new-book-view">
                <div class="new-book-item" v-for="(book,index) of newBook" :key="index">
                    <img :src="book.image.src" :alt="book.image.alt">
                    <p>{{book.description}}</p>
                </div>
            </div>
        </div>
        <!--猜你喜欢-->
        <div>
            <h3>猜你喜欢</h3>
            <div class="like-book-view">
                <div class="like-book-item" v-for="(book,index) of likeBook" :key="index">
                    <img :src="book.image.src" :alt="book.image.alt">
                    <p>{{book.description}}</p>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import {
        fetchBookCategory,
        fetchClassicBook,
        fetchLikeBook,
        fetchNewBook,
        fetchReadImage,
        fetchRecommendBook
    } from "@/api/read";

    export default {
        name: "index",
        data() {
            return {
                input2: "",
                select: "",
                path: "",
                bookCategory: [
                    {itemList: [{id: 1, content: "java"}, {id: 2, content: "redis"}, {id: 3, content: "mongo"}]},
                    {itemList: [{id: 1, content: "python"}]}
                ],
                bookImageCarousel: [],
                bookImageDisplay: [],
                dynamicTags: ["Java编程思想", 'Java虚拟机', 'Mysql学习'],
                inputVisible: false,
                inputValue: '',
                recommendBook: [],
                classicBook: [],
                newBook: [],
                likeBook: []
            }
        },
        methods: {
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
            },
            handleItemClick(path) {
                this.$router.push(path);
            },
            /**
             * 处理图书分类的点击
             */
            handleBookCategoryClick(){
            },
            /**
             * 处理图书的点击
             */
            handleBookClick(bookId){
                this.$router.push({ path: `/book/hub/${bookId}`});
            }
        },
        created() {
            fetchBookCategory().then(res => {
                this.bookCategory = res.data.data;
            });
            fetchReadImage().then(res => {
                this.bookImageCarousel = res.data.data.carousel;
                this.bookImageDisplay = res.data.data.display;
            });
            fetchRecommendBook().then(res => {
                this.recommendBook = res.data.data;
            });
            fetchClassicBook().then(res => {
                this.classicBook = res.data.data;
            });
            fetchNewBook().then(res => {
                this.newBook = res.data.data;
            });
            fetchLikeBook().then(res => {
                this.likeBook = res.data.data;
            });

        }
    }
</script>

<style lang="scss" scoped>
    li {
        list-style: none;
    }

    .category-wrapper {
        height: 480px;
        padding-inline-start: 0;
    }

    .category-book-view {
        border: solid 1px #ddd;
        display: inline-block;
        vertical-align: top;
        height: 100%;
    }

    .category-book-view ul {
        padding-left: 0;
        display: inline-block;
    }

    .category-li {
        clear: both;
    }

    .item-li {
        float: left;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
    }

    .item-li  a {
        color: #666;
        cursor: pointer;
    }
    .item-li a:hover{
        text-decoration: underline;
    }

    .carousel-display-view {
        margin-left: 40px;;
        display: inline-block;
        border: solid 1px #ddd;
        height: 100%;
    }

    .book-carousel-view {
        display: inline-block;
        width: 500px;
        height: 310px;
        vertical-align: top;
    }

    .book-display-item {
        display: inline-block;
        vertical-align: top;
        margin-left: 40px;
    }

    .book-display-item img {
        height: 150px;
        width: 200px;
    }

    .handle-book-view {
        display: inline-block;
        margin-left: 40px;
        width: 300px;
        height: 100%;
        vertical-align: top;
        border: solid 1px #ddd;

    }

    .handle-button-view {
        margin-top: 50px;
    }

    .handle-item {
        border: solid 1px #ddd;
        display: inline-block;
        width: auto;
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

    .analyze-book-input {
        width: 100%;
        height: 300px;
    }

    .recommend-book-item {
        display: inline-block;
        vertical-align: top;
        margin-left: 40px;
    }

    .recommend-book-item img {
        width: 200px;
        height: 200px;
    }

    .classic-book-item {
        display: inline-block;
        vertical-align: top;
    }

    .new-book-item {
        display: inline-block;
        vertical-align: top;
    }

    .like-book-item {
        display: inline-block;
        vertical-align: top;
    }
</style>
