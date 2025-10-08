<template>
    <div class="content-page">
        <div class="add-blog">
            <el-button class="add-blog-button" @click="handleAddBlog" type="primary">写博客</el-button>
        </div>
        <el-input placeholder="请输入内容" v-model="searchContent" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div class="advanced-search">
            <el-button class="advanced-search-button" type="text" @click="handleAdvancedContent">
                筛选
            </el-button>
            <el-card class="box-card">
                <div v-if="showAdvancedContent">
                    <div v-for="o in 4" :key="o" class="text item">
                        {{'列表内容 ' + o }}
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                showAdvancedContent: false,
                searchContent: ''
            }
        },
        methods: {
            handleAdvancedContent() {
                this.showAdvancedContent = !this.showAdvancedContent;
            },
            handleAddBlog() {
                this.$router.push({ path: `/blog/add`});
            }
        }
    }
</script>

<style scoped>
    .add-blog::after {
        clear: both;
        display: block;
        content: "";
    }

    .add-blog-button {
        float: right;
    }
</style>
