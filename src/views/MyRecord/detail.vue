<template>
  <div class="record-detail">
    <!-- 头部 -->
    <!-- <base-header 
            :head-title="headTitle+'详情'"
    />-->
    <div class="header flex-box cross-center">
      <div class="h-left">
        <slot name="left">
          <img @click="goBack" class="back icon" src="@/assets/close.png">
        </slot>
      </div>

      <div class="h-center item-grow">
        <slot name="center">
          <span>{{ headTitle }}详情</span>
        </slot>
      </div>

      <div class="h-right">
        <slot name="right">
          <img @click="goHome" class="home icon" src="@/assets/home.png">
        </slot>
      </div>
    </div>

    <!-- 补货详情 -->
    <div class="detail-content">
      <div
        class="detail-time"
        v-if="activeIndex==1"
      >{{headTitle}}时间 : {{detailInfo.return_time_str}}</div>
      <div class="detail-time flex-box main-space" v-if="activeIndex==0">
        <span>单据编号 ：{{detailInfo.record_id}}</span>
        <span>{{detailInfo.record_time_str}}</span>
      </div>

      <div class="table-content">
        <!-- 表头 -->
        <div class="table-row flex-box main-space">
          <span
            class="row-item"
            :class="{
                        'good-name':index==0&&activeIndex==0,
                        'good-cago':index==2&&activeIndex==0,
                        'good-name-img':index==0&&activeIndex==1,
                        'img-name':index==2&&activeIndex==1}"
            v-for="(item,index) in tableTitle"
            :key="index"
          >{{item}}</span>
        </div>
        <!-- 表格内容 -->
        <div v-if="activeIndex==0">
          <div
            class="table-row flex-box main-space"
            v-for="(tableItem,index) in detailArr"
            :key="index"
          >
            <span class="row-item good-name">{{tableItem.goods_name}}</span>
            <span class="row-item">{{tableItem.goods_num}}</span>
            <span class="row-item good-cago">{{tableItem.aisle_name}}</span>
            <!-- <span class="row-item"> 图片 </span>  -->
          </div>
        </div>

        <div class="table-row img-row flex-box main-space" v-if="activeIndex==1">
          <span class="row-item good-name">{{tableData.goods_name}}</span>
          <span class="row-item shop-address">{{tableData.return_address}}</span>
          <span class="row-item img-name">
            <img ref="goodCode">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import BaseHeader from "@/components/BaseHeader/index.vue";
import JsBarcode from "jsbarcode";
export default {
  props: {
    detailInfo: {
      type: [Object],
      default() {
        return {};
      }
    },
    detailArr: {
      type: [Array],
      default() {
        return [];
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    detailTime: {
      type: String,
      default: ""
    }
  },
  computed: {
    headTitle() {
      if (this.activeIndex === 0) {
        return "补货";
      } else {
        return "退货";
      }
    },
    tableTitle() {
      let tableTitle = ["商品", "数量", "货道"];
      if (this.activeIndex == 0) {
        tableTitle = ["商品", "数量", "货道"];
      } else {
        tableTitle = ["商品", "退回仓库", "商品条码"];
      }
      return tableTitle;
    },
    tableData() {
      let tableData = null;
      if (this.activeIndex == 0) {
        tableData = this.detailArr;
      } else {
        tableData = this.detailInfo;
        let barElm = null;
        let barOpts = {
          width: 1,
          height: 28,
          displayValue: false
        };
        this.$nextTick(function () {
          if (tableData.goods_bar_code) {
            barElm = this.$refs["goodCode"];
            JsBarcode(barElm, tableData.goods_bar_code, barOpts);
          }
        });
      }
      return tableData;
    }
    // BaseHeader
  },
  data() {
    return {
      // headTitle: "补货",
      // tableData: null
    };
  },
  created() {
    // if (this.activeIndex == 0) {
    //   this.tableData = this.detailArr;
    // } else {
    //   this.tableData = this.detailInfo;
    //   let barElm = null;
    //   let barOpts = {
    //     width: 1,
    //     height: 28,
    //     displayValue: false
    //   };
    //   this.$nextTick(function() {
    //     if (this.tableData.goods_bar_code) {
    //       barElm = this.$refs["goodCode"];
    //       JsBarcode(barElm, this.tableData.goods_bar_code, barOpts);
    //     }
    //   });
    // }
  },
  methods: {
    goBack() {
      this.$emit("on-close");
      // this.$router.go(-1);
    },
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-content {
  margin-top: px2rem(88);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  .detail-time {
    padding-left: px2rem(19);
    padding-right: px2rem(21);
    height: px2rem(68);
    line-height: px2rem(68);
    font-size: px2rem(32);

    color: rgba(50, 50, 50, 1);
    background: rgba(241, 241, 241, 1);
  }
  .table-content {
    font-size: px2rem(30);
    color: rgba(51, 51, 51, 1);
    .good-name {
      width: px2rem(250);
    }
    .good-cago {
      width: px2rem(100);
      text-align: center;
    }
    .img-row {
      .good-name {
        width: px2rem(300);
      }
    }
  }
}
.table-row {
  padding-bottom: px2rem(22);
  margin: px2rem(31) px2rem(41) px2rem(22) px2rem(30);
  font-size: px2rem(32);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  border-bottom: px2rem(1) solid rgba(138, 138, 138, 0.2);
  &:last-of-type {
    border-bottom: 0;
  }
}
.good-name-img {
  width: px2rem(230);
}
.img-name {
  width: px2rem(170);
}
.img-row {
  .img-name {
    width: px2rem(230);
  }
  .row-item {
    line-height: px2rem(100);
  }
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  height: px2rem(88);
  box-sizing: border-box;
}
.border-gray {
  border-bottom: 1px solid #e7e7e7;
}
.h-left,
.h-right {
  width: px2rem(122);
  text-align: center;
}
.h-center {
  text-align: center;
  font-size: px2rem(36);
}
.back.icon {
  width: px2rem(33);
  height: px2rem(33);
}
.home.icon {
  width: px2rem(60);
  height: px2rem(53);
}
</style>
