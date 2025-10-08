<template>
  <div>
    <el-radio-group v-model="recommendRadio" size="small">
      <el-radio-button label="提问"></el-radio-button>
      <el-radio-button label="文章"></el-radio-button>
      <el-radio-button label="关联"></el-radio-button>
    </el-radio-group>
    <div class="page-wrapper">
      <el-pagination class="page-pagination"
                     background
                     :hide-on-single-page="true"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     @current-change="handlePageChange"
                     @prev-click="handlePageChange"
                     @next-click="handlePageChange"
                     layout="prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "tool-edit-info-recommend",
  data() {
    return {
      recommendRadio: '',
      pageNum: 0,
      pageSize: 10,
      total: 0,
      hasNext: false,
      currentPage: 1
    }
  },
  methods: {
    handlePageChange() {

    },
  },
  created() {
    console.log("aaaaafdasdfsdafsadf")
  }
}
</script>

<style lang="scss" scoped>

.page-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>