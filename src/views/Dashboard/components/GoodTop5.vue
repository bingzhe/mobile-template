<template>

    <div class="good-top-5">
        <!-- 商品销售排行前五 -->
          <div class="gary-bar-tittle clear-flex">
          <!-- 左边框 -->
            <div class="left-border fl"></div>
            <div class="fl">商品销售排行前五</div>
        </div>
        <my-table :tableData="tableList" :tableTitle="tableTitle"/>
    </div>
   
</template>

<script>
import MyTable from "./child/MyTable.vue";
export default {
  props: {
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components: {
    MyTable
  },
  computed: {
    tableList() {
      return this.tableData;
    }
  },
  data() {
    return {
      // tableData: [], //列表数据
      tableTitle: ["排名", "商品名称", "数量", "金额"] //列表头
    };
  }
};
</script>

<style lang="scss" scoped>
.gary-bar-tittle {
  height: px2rem(70);
  line-height: px2rem(70);
  // padding-left: px2rem(24);
  background: rgba(241, 241, 241, 1);
  font-size: px2rem(32);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(50, 50, 50, 1);
}
.left-border {
  width: px2rem(6);
  height: px2rem(50);
  background: rgba(90, 150, 220, 1);
  margin-right: px2rem(20);
  margin-top: px2rem(10);
  box-sizing: border-box;
}
</style>


