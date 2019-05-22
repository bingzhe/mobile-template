<template>
    <div class="record-list-card">
       <div class="table-item flex-box main-space">
           <span> {{cardInfo.vendor_num||cardInfo.return_id}} </span>
           <span> {{cardInfo.record_time_str||cardInfo.return_time_str}}</span>
           <span v-if="activeIndex===0"> 补货成功 </span>
            <span v-else> 退货成功 </span>
           <span class="blue-text" @click="goToOrderDetail"> 详情 </span>
       </div>
    </div>
</template>

<script>
export default {
  props: {
    cardInfo: {
      type: Object,
      default: () => {
        return {
          record_id: "", //设备编号
          vendor_num:"", //设备编号
          record_time_str: "", //  正常  补货   通知断货
          return_id: "", //地址
          return_time_str: "" //距离
        };
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    goToOrderDetail() {
      this.$emit("go-detail");
    }
  }
};
</script>

<style lang="scss" scoped>
.order-time {
  width: px2rem(142);
  text-align: center;
}
.table-item {
  margin: 0 px2rem(20);
  height: px2rem(100);
  padding: px2rem(24) 0;
  box-sizing: border-box;
  font-size: px2rem(28);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(57, 57, 57, 1);
  // line-height:px2rem(100);
  border-bottom: px2rem(1) solid rgba(138, 138, 138, 0.2);
}
.blue-text {
  color: #5a96dc;
}
</style>

