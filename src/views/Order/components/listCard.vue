<template>
    <div class="order-list-card">
       <div class="table-item flex-box main-space">
           <span class="vendor-num"> {{cardInfo.vendor_num}} </span>
           <span class="vendor-num"> {{cardInfo.vendor_order_id}} </span>
           <span class="order-time"> {{cardInfo.pay_time_str}} </span>
           <span class="vendor-num"> {{cardInfo.pay_status_str}} </span>
           <span class="blue-text" @click="goToOrderDetail"> 详情</span>
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
          vendor_num: "SZ123456789123", //设备编号
          vendor_order_id: "VO8274", //订单编号
          order_status: 1, // 订单状态(1:未支付(待付款),2:已支付(交易完成),3:退款成功,)
          pay_time: 5, //交易时间
          pay_status_str: "已支付", //地址
          distance: 1.2, //距离
          pay_time_str: "2019.01.24 16:26"
        };
      }
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
  width: px2rem(152);
  text-align: center;
}
.table-item {
  margin: 0 px2rem(20);
  height: px2rem(100);
  padding: px2rem(24) 0 px2rem(10);
  box-sizing: border-box;
  // line-height:px2rem(100);
  border-bottom: px2rem(1) solid rgba(138, 138, 138, 0.2);
  span {
    display: inline-block;
  }
}
.vendor-num {
  width: px2rem(135);

  text-align: center;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: normal;
  // display: -webkit-box;
  // -webkit-line-clamp: 2;
  // -webkit-box-orient: vertical;
  word-break: break-all;

  text-overflow: ellipsis;

  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/

  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/

  -webkit-line-clamp: 2; /** 显示的行数 **/

  overflow: hidden; /** 隐藏超出的内容 **/
}

.blue-text {
  color: #5a96dc;
}
</style>

