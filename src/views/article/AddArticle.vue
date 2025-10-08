<template>
    <div>
        <p>添加博客</p>
    </div>
</template>

<script>
    import {addBlog} from "@/api/blog";

    export default {
        name: "AddBlog",
        data() {
            return {}
        },
        methods: {
            handleAddBlog() {
                addBlog();
            }
        }
    }
</script>

<style scoped>

</style>
