<template>
  <div class="detail-page">
    <!-- 头部 -->
    <div class="detail-head flex-box main-space">
      <!-- <span> 订单编码:{{cardInfo.vendor_order_id}}</span>
      <span> 设备编码:{{cardInfo.vendor_num}}</span>-->
      <div class="blue-head">设备编码 : {{cardInfo.vendor_num}}</div>
    </div>
    <!-- 商品信息 -->
    <div class="order-info table-info">
      <!-- <div class="info-row flex-box main-space">
                <span class="big-font">商品信息</span>
      </div>-->
      <div class="info-row flex-box main-space">
        <span
          v-for="(item,index) in goodInfo.tableTitle"
          class="row-item table-title"
          :class="{'good-name':index==0,'good-num':index==2}"
          :key="index"
        >{{item}}</span>
      </div>
      <div
        class="table-row info-row flex-box main-space"
        v-for="(tableItem,DataIndex) in goodInfo.tableData"
        :key="DataIndex"
      >
        <span class="row-item good-name">{{tableItem.goods_name}}</span>
        <span class="row-item">{{tableItem.aisle_name||"--"}}</span>
        <span class="row-item">￥{{tableItem.goods_price || 0 | numFixOne}}</span>
        <span class="row-item good-num">{{tableItem.goods_num}}</span>
        <span class="row-item">￥{{tableItem.all_money || 0 | numFixOne}}</span>
      </div>
      <div class="info-row total-num flex-box main-space">
        <span class="is-blood">共{{cardInfo.goods_all_num}}件商品</span>
        <span class="font-black">
          总计
          <span class="font-red">￥{{cardInfo.order_fee || 0 | numFixOne}}</span>
        </span>
      </div>
    </div>

    <!-- 下单信息 -->
    <div class="order-info">
      <div class="info-row flex-box main-space">
        <!-- <span class="border-left"></span> -->
        <span class="big-font">
          <span class="border-left"></span>订单信息
        </span>
      </div>
      <div class="info-row flex-box main-space" v-for="orderItem in orderInfo" :key="orderItem.key">
        <span>{{orderItem.label}}</span>
        <span class="weigth-text">{{orderItem.value}}</span>
      </div>
      <!-- <img src="@/assets/dash_bar.png" alt=""> -->
    </div>

    <!-- 支付信息 -->
    <div class="order-info">
      <div
        class="info-row pay-row flex-box main-space"
        v-for="orderItem in payInfo"
        :key="orderItem.key"
      >
        <span :class="{'is-blood':orderItem.isBlood,'big-font':orderItem.isTitle}">
          <span class="border-left" v-if="orderItem.isTitle"></span>
          {{orderItem.label}}
        </span>
        <span class="weigth-text" v-if="orderItem.isMoney">
          <span>￥</span>
          {{orderItem.value||0 | numFixOne}}
        </span>
        <span class="weigth-text" v-else>{{orderItem.value}}</span>
      </div>
      <!-- <img src="@/assets/dash_bar.png" alt=""> -->
    </div>

    <!-- 支付信息 -->
    <!-- <div class="order-info">
             <div class="info-row flex-box main-space">
                <span class="big-font">商品信息</span>
            </div>
            <div class=" info-row flex-box main-space">
                <span 
                    v-for="(item,index) in goodInfo.tableTitle"
                    class="row-item" 
                    :class="{'good-name':index==0,'good-num':index==2}"
                    :key="index"> 
                 {{item}} 
                 </span> 
            </div> 
            <div class="table-row info-row flex-box main-space" 
                v-for="(tableItem,DataIndex) in goodInfo.tableData" 
                :key="DataIndex">
                <span class="row-item good-name"> {{tableItem.goods_name}} </span> 
                <span class="row-item">￥{{tableItem.goods_price}} </span> 
                <span class="row-item good-num"> {{tableItem.goods_num}} </span> 
                <span class="row-item"> {{tableItem.aisle_name}} </span> 
                 <span class="row-item">￥{{tableItem.all_money}} </span> 
            </div> 
            <div class="info-row total-num flex-box main-space">
                  <span class="is-blood">商品总数:{{cardInfo.goods_all_num}}</span>
                   <span class="is-blood">￥{{cardInfo.order_fee}}</span>
            </div>
    </div>-->
  </div>
</template>
<script>
export default {
  props: {
    cardInfo: {
      type: Object,
      default: () => {
        return {
          vendor_order_id: "", //订单编号
          vendor_id: "", //设备编号
          order_status_str: 1, // 订单状态(1:未支付(待付款),2:已支付(交易完成),3:退款成功,)
          pay_time_str: 5, //支付时间
          pay_way_str: 1, //支付方式 （1:微信支付, 2:支付宝支付)
          order_fee: 9, //订单金额/应付金额
          paid_price: 9, //支付金额 (实收)
          goods_all_num: "", //商品总数
          goods_list: []
        };
      }
    }
  },
  computed: {
    orderInfo() {
      return [
        {
          label: "订单编号",
          value: this.cardInfo.vendor_order_id,
          key: 1
        },
        {
          label: "下单时间",
          value: this.cardInfo.order_time_str,
          key: 2
        },
        {
          label: "订单状态",
          value: this.cardInfo.order_status_str,
          key: 3
        }
      ];
    },
    payInfo() {
      return [
        {
          label: "支付信息",
          value: "",
          key: 0,
          isTitle: true
        },
        {
          label: "支付时间",
          value: this.cardInfo.pay_time_str,
          key: 1
        },
        {
          label: "支付状态",
          value: this.cardInfo.order_status_str,
          key: 2
        },
        {
          label: "支付方式",
          value: this.cardInfo.pay_way_str,
          key: 3
        },
        {
          label: "订单金额",
          value: this.cardInfo.order_fee,
          key: 4,
          isMoney: true
        },
        {
          label: "应收",
          value: this.cardInfo.order_fee,
          key: 5,
          isMoney: true
        },
        {
          label: "实收",
          value: this.cardInfo.paid_price,
          key: 6,
          isMoney: true
        }
      ];
    },
    goodInfo() {
      return {
        // tableTitle: ["名称", "单价", "数量", "出货货道", "价格"],
        tableTitle: ["商品名称", "货道", "单价", "数量", "小计"],
        tableData: this.cardInfo.goods_list
      };
    }
  }
};
</script>
<style lang="scss" scoped>
//页面
.detail-page {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
  top: px2rem(88);
  padding: px2rem(0) px2rem(21) px2rem(35) px2rem(19);
  background: #f1f1f1;
}
//头部
.detail-head {
  height: px2rem(68);
  line-height: px2rem(68);
  font-size: px2rem(32);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(50, 50, 50, 1);
}
.blue-head {
  width: px2rem(710);
  height: px2rem(92);
  padding-left: px2rem(20);
  line-height: px2rem(92);
  color: #fff;
  background: rgba(90, 150, 220, 1);
  border-radius: px2rem(6);
  margin-top: px2rem(20);
}
//订单信息
.order-info {
  margin-top: px2rem(20);
  background: #fff;
  font-size: px2rem(30);
  font-family: PingFang-SC-Regular;
  font-weight: bold;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  .info-row {
    padding-top: px2rem(0);
    height: px2rem(80);
    line-height: px2rem(80);
    margin: 0 px2rem(21);
    box-sizing: border-box;

    border-bottom: 0;
    &:first-of-type {
      border-bottom: px2rem(1) solid #e6e6e6;
    }
    .good-name {
      display: inline-block;
      width: px2rem(140);
      text-align: center;
    }
    .row-item {
      display: inline-block;
      width: px2rem(120);
      text-align: center;
      font-size: px2rem(28);
    }
    .good-num {
      width: px2rem(100);
    }
    .table-title {
      font-size: px2rem(30);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
  .pay-row {
    height: px2rem(88);
    line-height: px2rem(88);
    color: #8a8a8a;
    &:last-of-type {
      border-bottom: 0;
      line-height: px2rem(110);
    }
  }
  .table-row {
    font-size: px2rem(28);
    .good-name {
      width: px2rem(120);
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .total-num {
    height: px2rem(88);
    line-height: px2rem(88);
  }
  img {
    width: px2rem(720);
    height: px2rem(16);
    margin-left: px2rem(-5);
  }
}
.table-info {
  margin-top: px2rem(45);
  .info-row {
    border-bottom: px2rem(1) solid #e6e6e6;
  }
}
//加重字体
.weigth-text {
  color: #333333;
}

//粗体
.is-blood {
  font-family: PingFang-SC-Bold;
  // font-weight: bold;
  font-size: px2rem(32);
  color: rgba(51, 51, 51, 1);
}
.font-red {
  font-size: px2rem(40);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(220, 90, 102, 1);
}
.font-black {
  font-size: px2rem(40);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #333333;
}
//标题打字
.big-font {
  font-size: px2rem(32);
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.border-left {
  height: px2rem(40);
  margin-right: px2rem(10);
  // display: inline-block;
  // background:rgba(90,150,220,1);
  border-left: px2rem(4) solid rgba(90, 150, 220, 1);
}
</style>


