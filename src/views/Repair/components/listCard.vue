<template>
  <div class="list-card">
    <div class="card__info_row">
      <div class="card__row flex-box main-space">
        <div class="row__item blod-text">设备编号 : {{cardInfo.vendor_num}}</div>
        <div class="v-button danger" v-if="activeIndex==0" @click="goToDeal">去处理</div>
        <div class="v-button disabled" v-if="activeIndex!==0">已处理</div>
      </div>

      <div class="card__row flex-box main-space">
        <div class="row__item">地址 : {{cardInfo.address}}</div>
        <div class="row__item">设备状态 : {{cardInfo.vendor_status_str}}</div>
      </div>

      <div class="card__row flex-box main-space" v-if="activeIndex==0">
        <div class="row__item text-gray">
          <span class="icon">
            <img src="@/assets/location_gray.png" alt>
          </span>
          <span class="icon-box">{{ (cardInfo.distanceStr || 0) | numFix}} km</span>
          <span class="r-border"></span>
          <span class="icon-box">{{cardInfo.timeStr}}</span>
        </div>
        <div class="row__item text-gray">故障时间 : {{cardInfo.fault_time_str}}</div>
      </div>
      <div class="card__row clear-fix" v-if="activeIndex!==0">
        <div class="row__item text-gray fr">处理时间 : {{cardInfo.time_str}}</div>
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
          vendor_id: "12365412345", //设备编号
          vender_status: 1, //  正常  补货   通知断货
          address: "创锦一号", //地址
          distance: 1.2, //距离
          time: 5, //时间
          distanceStr: "",
          timeStr: "",
          break_time: "2018-1111 18:00"
        };
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      imgIcon: require("@/assets/down_blue.png"),
      VendorStatus
    };
  },
  methods: {
    goToDeal() {
      this.$emit("goToDeal");
    },
    openLocation(point) {
      WxConfig.openLocation(point.lat, point.lng);
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
  img {
    width: px2rem(20);
    height: px2rem(11);
  }
}
.dash-bar {
  width: px2rem(712);
  height: px2rem(20);
  margin-left: px2rem(-20);
}
//卡片
.list-card {
  font-size: px2rem(28);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #393939;
  margin: px2rem(30) px2rem(20) 0;
  width: px2rem(710);
  height: 100%;
  box-shadow: 0px 0px 7px 0px rgba(51, 51, 51, 0.2);
  background: rgba(255, 255, 255, 1);
  border-radius: px2rem(20);
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
</style>
