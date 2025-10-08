<template>
  <div>
    <div v-if="sourceList.length > 0" class="api-source-wrapper">
      <ul v-for="source in sourceList" :key="source.id">
        <li class="source-row">
          <div class="source-details">
            <router-link :to="'/source/' + source.id">
              <span>{{source.sourceName}}</span>
            </router-link>
            <el-button @click.stop="handleDeleteSource(source.id)" type="danger" plain>删除</el-button>
          </div>
        </li>
      </ul>
      <el-pagination
          background
          @size-change="sizeChange"
          @prev-click="prevClick"
          @next-click="nextClick"
          :page-size="pageSize"
          :hide-on-single-page=true
          layout="prev, pager, next"
          :total="pageTotal">
      </el-pagination>
    </div>
    <el-empty v-else description="描述文字"></el-empty>
  </div>
</template>

<script>
  import {removeSource} from "@/api/api-source";

  export default {
    name: "home-source",
    props: {
      sourceList: Array
    },
    data() {
      return {
        pageNum: 1,
        keyword: '',
        pageSize: 10,
        pageTotal: 0,
      }
    },
    methods: {
      sizeChange(e) {
        this.$emit('size-change', e);
      },
      prevClick(e) {
        this.$emit('prev-click', e);
      },
      nextClick(e) {
        this.$emit('next-click', e);
      },
      handleDeleteSource(id) {
        removeSource(id);
        // 删除api源列表yem
        this.$emit('refresh');
      }
    },
    created() {
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>

</style>
