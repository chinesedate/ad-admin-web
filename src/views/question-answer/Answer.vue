<template>
<div class="content-page">
    <p>作答</p>
</div>
</template>

<script>
    import {addAnswer} from "@/api/answer";

    export default {
        name: "Answer",
        data(){
            return {

            }
        },
        methods:{
            handleAddAnswer(){
                addAnswer()
            }
        }
    }
</script>

<style scoped>

</style>
