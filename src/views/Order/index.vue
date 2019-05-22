<template>
  <div class="order-list">
    <!-- 头部 -->
    <base-header head-title="订单管理"/>

    <div class="order-list-box">
      <div class="gray-bar"></div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- table-row -->
        <div class="table-row">
          <span
            class="row-item"
            v-for="(item,index) in tableTitle"
            :key="index"
            :class="{
              'vendor-num':index===0,
              'order-time':index==2,
              'order-timea':index==1}"
          >{{item}}</span>
        </div>
        <list-card
          v-for="(item,index) in list"
          :key="index"
          :cardInfo="item"
          @go-detail="goToOrderDetail(item.vendor_order_id)"
        />
      </van-list>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { vendorOrderGet } from "@/api/api";
import { OrderStatus, errcode } from "@/config/cfg";
import { Public } from "@/config/public";
import BaseHeader from "@/components/BaseHeader/index.vue";
import ListCard from "./components/listCard.vue";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      OrderStatus, //订单状态
      list: [], //订单列表
      page_no: 1,
      page_size: 15,
      tableTitle: ["设备编号", "订单编号", "交易时间", "交易状态"]
    };
  },
  components: {
    BaseHeader,
    ListCard
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      let data = {
        get_order_list: 1, //参数
        shop_id: Public.getShopid(), // 店铺id  //测试数据
        page_no: this.page_no,
        page_size: this.page_size
      };
      vendorOrderGet(data).then(resp => {
        if (resp.ret === 0) {
          let list = resp.data.order_list;
          let total = resp.data.total;
          list.forEach(element => {
            element.pay_status_str = this.OrderStatus.toString(
              element.order_status
            );
            element.pay_time_str = dayjs(element.pay_time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );
          });
          this.list = [...this.list, ...list];
          this.loading = false;
          this.refreshing = false;

          if (this.list.length === total) {
            this.finished = true;
          }
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    //加载
    onLoad() {
      this.page_no++;
      this.getList();
    },

    goToOrderDetail(orderid) {
      this.$router.push({
        path: "/order/detail",
        query: {
          order_id: orderid
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.order-list-box {
  margin-top: px2rem(88);
  height: px2rem(88);
  font-size: px2rem(30);
  position: relative;
  div.gray-bar {
    height: px2rem(14);
    background: #eeeeee;
  }

  .table-row {
    padding: 0 px2rem(0) 0 px2rem(23);
    height: px2rem(88);
    line-height: px2rem(88);
    .row-item {
      display: inline-block;
      width: px2rem(160);
      box-sizing: border-box;
      &:last-of-type {
        margin-right: px2rem(0);
      }
    }
    .order-time {
      width: px2rem(190);
      padding-left: px2rem(30);
    }
  }
}
</style>
