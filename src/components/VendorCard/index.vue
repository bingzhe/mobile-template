<template>
  <div class="list-card">
    <div class="card__info_row">
      <div class="card__row flex-box main-space">
        <div @click="nameClickHandle" class="row__item blod-text">设备编号： {{cardInfo.vendor_num}}</div>
        <div
          v-if="cardInfo.vendor_status===VendorStatus.SHORT"
          class="v-button danger"
          @click="shortClickHandle"
        >通知断货</div>
        <div
          v-if="cardInfo.vendor_status==VendorStatus.LACK"
          class="v-button danger"
          @click="replenishClickHandle"
        >补货</div>
        <div
          v-if="cardInfo.vendor_status==VendorStatus.DAMAGE"
          class="v-button danger"
          @click="damageClickHandle"
        >故障</div>
        <div
          v-if="cardInfo.vendor_status==VendorStatus.NORMAL"
          class="v-button primary"
          @click="normalClickHandle"
        >正常</div>
        <div
          v-if="cardInfo.vendor_status==VendorStatus.OFFLINE"
          class="v-button danger"
          @click="offlineClickHandle"
        >离线</div>
      </div>

      <div class="card__row flex-box main-space vendor-detail-info">
        <div class="row__item address">地址 : {{cardInfo.area}}{{cardInfo.address}}</div>
        <div class="row__item short">缺货数 : {{cardInfo.stock_num}}</div>
        <div class="row__item out">断货数 : {{cardInfo.out_num}}</div>
      </div>

      <div class="card__row flex-box main-space">
        <div class="row__item text-gray" @click="openLocation(cardInfo.point)">
          <span class="icon">
            <img src="@/assets/location_gray.png" alt>
          </span>
          <span class="icon-box">{{ (cardInfo.distanceStr || 0) | numFix}} km</span>
          <span class="r-border"></span>
          <span class="icon-box">{{cardInfo.timeStr}}</span>
        </div>
        <div
          class="row__item"
          @click="showDetal"
          v-if="cardInfo.stockout_list&&cardInfo.stockout_list.length>0"
        >
          <div class="text-blue flex-box cross-center">
            <span>缺货 / 断货详情</span>
            <img :src="imgIcon">
          </div>
        </div>
      </div>
      <!-- 虚线bur -->
      <img src="@/assets/dash_bar.png" class="dash-bar" v-if="isShowDetail">

      <div v-if="isShowDetail">
        <div
          class="card__row flex-box main-space"
          v-for="(detailItem,index) in cardInfo.stockout_list"
          :key="index"
        >
          <div class="row__item">{{detailItem.vendor_goods_name}}{{detailItem.goods_spec}}</div>
          <div v-if="detailItem.goods_num" class="row__item">{{detailItem.goods_num}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VendorStatus } from "@/config/cfg";
import WxConfig from "@/config/wxConfig";

export default {
  props: {
    cardInfo: {
      type: Object,
      default: () => {
        return {
          vendor_id: "", //设备编号
          vendor_status: 1, //  正常  补货   通知断货
          address: "", //地址
          stock_num: 0, //缺货数
          out_num: 0, //断货数量
          distance: 1, //距离
          time: 5, //时间,
          distanceStr: "",
          timeStr: "",
          stockout_list: [
            {
              goods_name: "",
              goods_num: 12
            }
          ]
        };
      }
    }
  },
  data() {
    return {
      isShowDetail: false,
      imgIcon: require("@/assets/down_blue.png"),
      VendorStatus
    };
  },
  methods: {
    showDetal() {
      this.isShowDetail = !this.isShowDetail;
      if (this.isShowDetail) {
        this.imgIcon = require("@/assets/up_blue.png");
      } else {
        this.imgIcon = require("@/assets/down_blue.png");
      }
    },
    shortClickHandle() {
      this.$emit("on-short");
    },
    replenishClickHandle() {
      this.$emit("on-replenish");
    },
    normalClickHandle() {
      this.$emit("on-normal");
    },
    damageClickHandle() {
      this.$emit("on-damage");
    },
    nameClickHandle() {
      this.$emit("name-click");
    },
    openLocation(point) {
      WxConfig.openLocation(point.lat, point.lng);
    },
    offlineClickHandle() {
      this.$emit("on-offline");
    }
  }
};
</script>

<style lang="scss" scoped>
//灰色字
.text-gray {
  color: #999999;
}

//右边border
.r-border {
  border-right: 1px solid #999999;
}

//大号字
.blod-text {
  font-size: px2rem(32);
  color: #333333;
}

//蓝色字
.text-blue {
  color: #5a96dc;
  span {
    margin-right: px2rem(8);
  }
  img {
    width: px2rem(20);
    height: px2rem(11);
  }
}
.dash-bar {
  width: 100%;
  height: px2rem(20);
}
//卡片
.list-card {
  box-shadow: 0px 0px 7px 0px rgba(51, 51, 51, 0.2);
  background: rgba(255, 255, 255, 1);
  border-radius: px2rem(20);
  font-size: px2rem(28);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #393939;
}

.card__info_row {
  padding: px2rem(34) px2rem(20) 0;
  .card__row {
    height: px2rem(60);
    line-height: px2rem(60);
    .icon-box {
      margin: 0 px2rem(8);
      display: inline-block;
    }
    .icon {
      img {
        width: px2rem(16);
        height: px2rem(20);
      }
    }
  }
}
.vendor-detail-info {
  .address {
    width: px2rem(350);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .short {
    width: px2rem(150);
  }
  .out {
    width: px2rem(150);
  }
}
</style>
