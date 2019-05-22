<template>
  <div class="my-table">
    <!-- table-row -->
    <!-- <div class="table-row flex-box main-space">
            <span class="row-item" v-for="(item,index) in tableTitle" :key="index"> {{item}} </span> 
    </div>-->
    <!-- table-row -->
    <div class="table-row flex-box main-space" v-for="(tableItem,index) in listData" :key="index">
      <span class="row-item">{{tableItem.rank}}</span>
      <span
        class="row-item"
        :class="{'row-name':index==0&&!tableItem.goods_name,'row-good-name':tableItem.goods_name}"
      >{{tableItem.vendor_name||tableItem.goods_name}}</span>
      <span
        class="row-item"
        :class="{'row-num':!tableItem.goods_name}"
      >{{tableItem.vendor_num||tableItem.all_num}}</span>
      <span
        class="row-item"
        v-if="!isNaN(tableItem.price)||!isNaN(tableItem.all_money)"
      >{{tableItem.all_money||tableItem.price | numFixOne}}</span>
      <!-- {{tableItem.all_money||tableItem.price | numFixOne}} -->
      <span class="row-item" v-else>{{tableItem.all_money||tableItem.price}}</span>
    </div>
    <div class="no-data" v-if="isEmpty">
      <img src="@/assets/no_data.png" alt>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    tableTitle: {
      type: Array,
      default: function () {
        return ["排名", "设备名称", "设备编号", "金额"];
      }
    }
  },
  data() {
    return {
      // listData:[]
    };
  },

  mounted() {
    // let obj = {
    //   rank:"排名",
    //   vendor_name:"设备名称",
    //   vendor_num:"设备编号",
    //   all_money:"金额"
    // }
    // this.listData.unshift(obj);
    // this.listData = this.tableData;
    // console.log(111,this.tableData);
    // this.listData = this.listData.map((item, index) => {
    //   item.rank = parseInt(index + 1);
    //   return item;
    // });
  },
  computed: {
    isEmpty() {
      return this.tableData.length === 0;
    },
    listData() {
      this.tableData.map((item, index) => {
        if (index !== 0) {
          item.rank = parseInt(index);
          return item;
        }
      });
      return this.tableData;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-table {
  text-align: center;
}
.table-row {
  padding: px2rem(31) px2rem(49) px2rem(22) px2rem(23);
  text-align: center;
  font-size: px2rem(32);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  border-bottom: px2rem(1) solid rgba(138, 138, 138, 0.2);
}
// .row-item {
//   //  padding: 0 px2rem(10);
// }
.row-name,
.row-num {
  width: px2rem(230);
  padding-right: px2rem(80);
  box-sizing: border-box;
}
.row-num {
  text-align: center;
  padding-right: px2rem(0);
}
.row-good-name {
  // text-align: center;
  width: px2rem(230);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// .good-price {
//   //  width: px2rem(120);
// }
.no-data {
  margin-top: px2rem(136);
  color: rgba(154, 159, 180, 1);
  font-size: px2rem(24);
  font-family: PingFang-SC-Regular;
  font-weight: bold;
  img {
    width: px2rem(323);
    margin-bottom: px2rem(39);
  }
}
</style>

