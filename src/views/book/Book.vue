<template>
    <div class="book">
        <div id="header">
            <h1>{{book.title}}</h1>
            <div id="catalogue" :class="{'is-position-fixed': positionFixed}">
                <el-card v-if="!hideHeader" shadow="hover">
                    <template v-slot:header>
                        <el-row>
                            <el-button type="primary">集阅</el-button>
                        </el-row>
                    </template>
                    <template v-slot:default>
                        {{book.title}}
                    </template>
                </el-card>
                <el-card v-else shadow="hover">
                    {{book.title}}
                </el-card>
                <el-input class="book-filter"
                          placeholder="输入关键字进行过滤"
                          v-model="filterText">
                </el-input>
                <el-tree class="toc" :data="data" :props="defaultProps" default-expand-all
                         :highlight-current="true"
                         :filter-node-method="filterNode"
                         node-key="labelId"
                         @node-click="handleNodeClick" ref="tree"></el-tree>
                <el-popover
                        id="add-popover"
                        v-show="this.chooseLabel !== ''"
                        placement="bottom-end"
                        title="标题"
                        width="400"
                        trigger="click"
                        @show="isPopoverShow = true"
                        @hide="isPopoverShow = false"
                >
                    <div class="label-item-option">
                        <el-row>
                            <el-button @click.stop="handleLabelOptionButtonClick('add-question')" plain>提问</el-button>
                            <el-button @click.stop="handleLabelOptionButtonClick('add-comment')" plain>写短评</el-button>
                            <el-button @click.stop="handleLabelOptionButtonClick('add-article')" plain>写文章</el-button>
                            <!--点击这里有更多选择，比如添加文章勘误信息-->
                            <i class="el-icon-circle-plus-outline"></i>
                        </el-row>
                        <keep-alive>
                            <component v-bind:is="optionComponent" :bookId="id" :linkLabelId="chooseLabel"></component>
                        </keep-alive>
                    </div>
                    <div slot="reference" ref="addPopover">
                        <el-button type="primary" icon="el-icon-edit" circle></el-button>
                    </div>
                </el-popover>
            </div>
        </div>
        <div id="content">
            <div id="description" class="anchor">
                <img class="book-image" :src="book.image.src" :alt="book.image.alt">
            </div>
            <div class="catalogue-anchor-wrapper">
                <div v-for="(item, index) in labelList" :key="index" :id="item.labelId" class="label-item"
                     @mouseenter="handleLabelMouseEnter(item.label)"
                     @mouseleave="handleLabelMouseLeave"
                     @click="handleLabelClick(item)"
                     :class="{'is-hover': hoverLabel === item.label}"
                >
                    <h4>
                        <el-link class="label-anchor"
                                 @click="handleLabelAnchorClick(item.labelId)"
                                 :underline="false">#
                        </el-link>
                        {{item.label}}
                        <i @click.stop="handleLabelIconClick(item)" v-show="hoverLabel === item.label"
                           class="el-icon-edit"></i>
                    </h4>
                    <div v-if="showContentLabel === item.labelId" class="label-content">
                        <div v-for="(labelLink, index) in labelLinkList" :key="index" :id="labelLink.id">
                            {{labelLink.content}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="footer"></div>
    </div>
</template>

<script>
    import throttle from "throttle-debounce/throttle";
    import {fetchBook} from "@/api/book";
    import {fetchLabelLinkList} from "@/api/label";
    import AddComment from "@/views/book/book-component/add-comment";
    import AddArticle from "@/views/book/book-component/add-article";
    import AddQuestion from '@/views/book/book-component/add-question';
    import {uuidGenerator} from "@/api/uuid";

    export default {
        name: "Book",
        props: ['id'],
        data() {
            return {
                book: {image: {src: ''}},
                bookPage: null,
                filterText: '',
                hideHeader: false,
                positionFixed: false,
                data: [
                    {
                        label: '书本简介'
                    },
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
                },
                labelList: [],
                chooseLabel: '',
                hoverLabel: '',
                showContentLabel: '',
                // 不同值用以切换显示不同组件
                optionComponent: '',
                isPopoverShow: true,
                // 当前激活的标签
                activeLabel: '',
                labelLinkList: []
            }
        },
        components: {
            'add-comment': AddComment,
            'add-article': AddArticle,
            'add-question': AddQuestion
        },
        methods: {
            handleNodeClick(data) {
                this.$router.push({path: `/book#${data.labelId}`, query: {bookId: this.id}});
            },
            /**
             * 处理标签的hover变化
             * @param label 标签信息
             */
            handleLabelMouseEnter(label) {
                this.hoverLabel = label;
            },
            /**
             * 处理标签的hover变化
             */
            handleLabelMouseLeave() {
                this.hoverLabel = '';
            },
            /**
             * 处理标签点击事件
             */
            handleLabelClick(label) {
                // 首先将标签对应关联内容列表置空，避免标签切换时因异步请求导致显示闪现前一标签关联内容
                this.labelLinkList = [];
                if (this.showContentLabel === '') {
                    this.showContentLabel = label.labelId;
                } else if (this.showContentLabel === label.labelId) {
                    this.showContentLabel = ''
                } else {
                    this.showContentLabel = label.labelId;
                }
                // 获取标签的短评列表
                fetchLabelLinkList({
                    pageNum: 0,
                    pageSize: 10,
                    data: {bookId: this.id, linkLabelId: label.labelId}
                }).then(res => {
                    this.labelLinkList = res.data.data.list;
                });
            },
            /**
             * 处理标签#点击事件，该标签对应内容滚动到页面顶部
             * @param id 标签对应的id
             */
            handleLabelAnchorClick(id) {
                this.$router.push({path: `/book#${id}`, query: {bookId: this.id}});
                this.$refs.tree.setCurrentKey(id);
            },
            /**
             * 处理标签图标点击事件，展开标签内容
             */
            handleLabelIconClick(label) {
                if (this.chooseLabel === '') {
                    this.chooseLabel = label.labelId;
                    this.$refs.addPopover.click();
                } else if (this.chooseLabel === label.labelId) {
                    this.chooseLabel = '';
                    if (this.isPopoverShow) {
                        this.$refs.addPopover.click();
                    }
                } else {
                    this.chooseLabel = label.labelId;
                }
                // vuex 记录当前激活的标签
                this.$store.commit('label/SET_CHOOSE_LABEL', {chooseLabel: this.chooseLabel});
            },
            /**
             * 处理标签选择按钮点击事件，切换组件
             * @param 按钮标识
             */
            handleLabelOptionButtonClick(buttonTag) {
                this.optionComponent = buttonTag;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            parquetLabelList(labelList, catalogue) {
                catalogue.forEach(item => {
                    item.labelId = item.label.replaceAll(" ", "-");
                    labelList.push({label: item.label, labelId: item.labelId});

                    if (item.children) {
                        this.parquetLabelList(labelList, item.children);
                    }
                })
            },
            /**
             * 页面滚动处理
             * @param event 滚动事件信息
             */
            handleScroll(event) {
                let top = event.target.scrollingElement.scrollTop;    // 获取页面滚动高度
                this.positionFixed = top >= 60;
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            fetchBook(this.id).then(res => {
                this.book = res.data.data;
                this.data = JSON.parse(res.data.data.catalogue);
                this.data.unshift({
                    id: uuidGenerator(),
                    label: '书本简介'
                });
                this.parquetLabelList(this.labelList, this.data);
            });
        },
        mounted() {
            this.bookPage = document;
            this.throttledScrollHandler = throttle(100, true, this.handleScroll, true);
            //监听页面滚动事件
            this.bookPage.addEventListener("scroll", this.throttledScrollHandler);
        },
        beforeDestroy() {
            this.bookPage.removeEventListener('scroll', this.throttledScrollHandler);
        }
    }
</script>

<style lang="scss" scoped>
    h1 {
        margin: 0;
    }

    .book {
        position: relative;
        height: 2000px;
    }

    .book-image {
        width: 160px;
        height: 240px;
    }

    .book-filter {
        margin-top: 20px;
    }

    #add-popover {
        position: absolute;
        top: 200px;
        right: -800px;
    }

    #catalogue {
        position: absolute;
        top: 0;
        width: 280px;
        margin-left: -310px;
        margin-top: 20px;
    }

    #catalogue.is-position-fixed {
        position: fixed;
        top: 0;
        width: 280px;
        margin-left: -310px;
        margin-top: 20px;
    }

    .toc {
        margin-top: 20px;
    }

    .el-aside {
        width: 400px;
    }


    #header, #content, #footer {
        background-repeat: repeat-y;
        background-position: 300px 0;
        background-image: url('../../assets/pixel.png');
        padding-left: 310px;
        padding-right: 210px;
    }

    .anchor:before {
        content: "";
        display: block;
        margin-top: -40px;
        height: 40px;
        visibility: hidden;
    }

    .label-item {
        cursor: pointer;
        padding-top: 40px;
    }

    .label-item .label-anchor {
        opacity: 0;
    }

    .label-item i {
        margin-left: 10px;
    }

    .label-item.is-hover .label-anchor {
        opacity: 1;
    }

    /*.label-content {*/
    /*    display: none;*/
    /*}*/

    /*.label-content.is-show {*/
    /*    display: block;*/
    /*}*/


    .book /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: #191E1E
    }


</style>
