<template>
    <div class="book-screen-view">
        <div class="screen-select">
            <span>筛选：</span>
            <el-tag size="mini" v-for="(tag,index) of screenTag"
                    v-bind:key="index"
                    v-on:close="handleScreenTagClose(index)"
                    closable>{{tag}}</el-tag>
        </div>
        <div class="screen-item-wrapper">
            <div class="screen-item" v-for="(screenItem, screenIndex) of bookScreen" v-bind:key="screenIndex">
                <div class="item-head">
                    <h4><span>{{screenItem.category}}</span>:</h4>
                </div>
                <ul class="item-body">
                    <li v-for="(item,itemIndex) of screenItem.item"
                        @click="handleScreenItemClick(item)"
                        v-bind:key="itemIndex">
                        {{item}}
                    </li>
                </ul>
                <div class="item-foot">
                    <el-button>多选</el-button>
                    <el-button>更多</el-button>
                </div>
            </div>
        </div>
        <div class="screen-result"></div>
    </div>
</template>

<script>
    import {fetchScreen} from "@/api/screen";

    export default {
        name: 'BookScreen',
        props: ['content'],
        data() {
            return {
                bookScreen: [],
                screenTag: []
            }
        },
        methods: {
            handleScreenItemClick(item) {
                this.screenTag.push(item);
                console.log(this.screenTag);

            },
            handleScreenTagClose(index){
                this.screenTag.splice(index, 1);
            }
        },
        created() {
            fetchScreen(this.content).then(response => {
                this.bookScreen = response.data.data;
            })
        }
    }
</script>

<style scoped>
    .screen-item-wrapper {
        border: solid 1px #ddd;
        padding: 10px;
    }

    .item-head {
        display: inline-block;
    }

    .item-body {
        display: inline-block;
    }

    .item-body li {
        display: inline-block;
        list-style-type: none;
        margin: 0 20px;
    }

    .item-foot {
        display: inline-block;
    }
</style>
