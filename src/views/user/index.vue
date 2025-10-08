<template>
  <div class="user-info">
    <div class="info-label">
      <el-table
          :data="tableData"
          @row-click="tableRowClick"
          border
          style="width: 100%">
        <el-table-column
            prop="item"
            label="个人信息"
            width="180">
        </el-table-column>
      </el-table>
    </div>
    <div class="info-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['userId'],
    data() {
      return {
        tableData: [
          {
            item: '书本',
            route: 'book'
          },
          {
            item: '账户',
            route: 'account'
          },
          {
            item: '关注',
            route: 'follow'
          },
          {
            item: '收藏',
            route: 'favorite'
          },
          {
            item: '贡献',
            route: 'contribution'
          },
          {
            item: '荣誉',
            route: 'honor'
          },
          {
            item: '收益',
            route: 'income'
          },
          {
            item: '设置',
            route: 'setting'
          },
          {
            item: '历史',
            route: 'history'
          }]
      }
    },
    methods: {
      tableRowClick(row) {
        this.$router.push("/user/" + this.userId + "/" + row.route);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .user-info {
    display: flex;
    margin-top: 80px;
    margin-left: 120px;
  }

  .info-label {
  }

  .info-content {
    margin-top: 20px;
    margin-left: 20px;
  }
</style>
