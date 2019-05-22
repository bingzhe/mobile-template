<template>
  <div class="order-detail">
    <!-- 头部 -->
    <base-header head-title="订单详情"/>
    <detail-list :cardInfo="orderInfro"/>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { vendorOrderGet } from "@/api/api";
import { OrderStatus, errcode, PayWay } from "@/config/cfg";
import BaseHeader from "@/components/BaseHeader/index.vue";
import DetailList from "./components/detail.vue";
export default {
  components: {
    BaseHeader,
    DetailList
  },
  data() {
    return {
      orderInfro: {},
      OrderStatus,
      PayWay
    };
  },
  mounted() {
    let order_id = this.$route.query.order_id;
    if (order_id) {
      this.getData(order_id);
    }
  },
  methods: {
    getData(order_id) {
      let data = {
        get_order_info: 1, //参数
        vendor_order_id: order_id //订单id,列表中获取
      };
      vendorOrderGet(data).then(resp => {
        if (resp.ret === 0) {
          this.orderInfro = resp.data.info;
          if (this.orderInfro.pay_time) {
            this.orderInfro.pay_time_str = dayjs(
              this.orderInfro.pay_time * 1000
            ).format("YYYY.MM.DD HH:mm");
          }

          if (this.orderInfro.order_status) {
            this.orderInfro.order_status_str = this.OrderStatus.toString(
              this.orderInfro.order_status
            );
          }
          if (this.orderInfro.pay_way) {
            this.orderInfro.pay_way_str = this.PayWay.toString(
              this.orderInfro.pay_way
            );
          }

          if (this.orderInfro.order_time) {
            this.orderInfro.order_time_str = dayjs(
              this.orderInfro.order_time * 1000
            ).format("YYYY.MM.DD HH:mm");
          }
          console.log(this.orderInfro.order_time_str);
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

