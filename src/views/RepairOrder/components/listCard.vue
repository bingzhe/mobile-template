<template>
  <div class="list-card">
    <div class="card__info_row">
      <div class="card__row flex-box main-space">
        <div class="row__item blod-text">设备编号 : {{cardInfo.vendor_num}}</div>
        <div class="v-button danger" v-if="activeIndex==0" @click="goToDeal">派单</div>
      </div>
      <!-- 已经派单的不显示 -->
      <div class="card__row flex-box main-space">
        <div class="row__item">地址 : {{cardInfo.address}}</div>
        <div class="row__item">设备状态 : {{cardInfo.vendor_status_str}}</div>
      </div>

      <!-- //待派单 -->
      <div class="card__row flex-box" v-if="activeIndex==0">
        <div class="row__item text-gray time-str">
          <span class="icon">
            <img src="@/assets/location_gray.png" alt>
          </span>
          <!-- <span class="icon-box">{{ (cardInfo.distanceStr || 0) | numFix}} km</span> -->
          <span class="icon-box">1454.32 km</span>
          <span class="r-border"></span>
          <!-- <span class="icon-box">{{cardInfo.timeStr}}</span> -->
          <span class="icon-box">20小时1分钟</span>
        </div>
        <div class="row__item text-gray time-tw">故障时间 : {{cardInfo.fault_time_str}}</div>
      </div>
      <div class="remark-content" v-if="cardInfo.deal_remark">
        <!-- v-if="cardInfo.deal_remark" -->
        <div class="fr" @click="toggleRemark">
          备注
          <img :src="btnImg" alt>
        </div>
        <div class="remark-info" v-if="isShowRemark">
          <div class="remark-item text-gray">处理人: {{cardInfo.deal_name||"--"}}</div>
          <div class="remark-item text-gray">处理时间: {{cardInfo.time_str||"--"}}</div>
          <div class="remark-item">
            <span class="text-gray">结果描述:</span>
            {{cardInfo.deal_remark}}
          </div>
          <!-- {{cardInfo.deal_remark}} -->
        </div>
      </div>

      <!-- 已经派单 -->
      <div class="card__row flex-box main-space" v-if="activeIndex!==0">
        <div class="row__item text-gray">
          <div class="row__item">故障处理人员 : {{cardInfo.deal_name}}</div>
        </div>
        <div class="row__item" @click="showDetal">
          <div class="text-blue">
            <span>进度详情</span>
            <span>
              <img :src="imgIcon" alt>
            </span>
          </div>
        </div>
      </div>
      <!-- 进度详情 -->
      <!-- 虚线bur -->
      <img src="@/assets/dash_bar.png" alt class="dash-bar" v-if="isShowDetail">
      <div v-if="isShowDetail">
        <van-steps direction="vertical" :active="0" active-color="#f44">
          <van-step>
            <p>{{detailInfo.deal_name}}{{detailInfo.deal_status_str}}</p>
            <p>{{detailInfo.now_time_str}}</p>
          </van-step>
          <van-step>
            <p>分配给 : {{detailInfo.deal_name}}</p>
            <p>{{detailInfo.send_time_str}}</p>
          </van-step>
          <van-step>
            <p>故障时间 : {{detailInfo.fault_time_str}}</p>
          </van-step>
        </van-steps>
        <!-- <ul>
                      <li>
                        <span class="step-icon">
                            <img src="@/assets/checked.png" alt="">
                        </span>
                        <span>08042 处理中</span>
                         <span>2019-11-12 12:12:12</span>
                      </li>
        </ul>-->
      </div>

      <div class="btn-group flex-box" v-if="activeIndex!==0">
        <div class="v-button disabled round lef-btn" v-if="isCantReminder">催单</div>
        <div class="v-button plain round lef-btn" @click="reminder" v-else>催单</div>
        <div class="v-button round" @click="reorder">重新派单</div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { faultGet, faultSave } from "@/api/api";
import { VendorStatus, errcode, DealSteps } from "@/config/cfg";
import WxConfig from "@/config/wxConfig";
export default {
  props: {
    cardInfo: {
      type: Object,
      default: () => {
        return {
          vendor_id: "", //设备编号
          vender_status: 1, //  正常  补货   通知断货
          address: "", //地址
          distance: 1.2, //距离
          time: 5, //时间
          distanceStr: "",
          timeStr: "",
          break_time: "",
          is_reminder: 0
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
      isReminder: false,
      isShowDetail: false,
      isShowRemark: false,
      imgIcon: require("@/assets/down_blue.png"),
      VendorStatus,
      DealSteps,
      detailInfo: {},
      btnImg: require("@/assets/down2.png")
    };
  },
  computed: {
    isCantReminder() {
      if (this.cardInfo.is_reminder == 1 || this.isReminder) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    //点击派单
    goToDeal() {
      this.$emit("goToDeal");
    },
    //点击重新派单
    reorder() {
      this.$emit("reorder");
    },
    //显示备注
    toggleRemark() {
      this.isShowRemark = !this.isShowRemark;
      if (!this.isShowRemark) {
        this.btnImg = require("@/assets/down2.png");
      } else {
        this.btnImg = require("@/assets/up2.png");
      }
    },
    //显示进度条
    showDetal() {
      this.isShowDetail = !this.isShowDetail;
      if (this.isShowDetail) {
        this.imgIcon = require("@/assets/up_blue.png");
      } else {
        this.imgIcon = require("@/assets/down_blue.png");
      }
      this.getDetailData();
    },
    getDetailData() {
      let data = {
        get_fault_info: 1, //参数
        fault_id: this.cardInfo.fault_id //故障列表里面获取id
      };
      faultGet(data).then(resp => {
        if (resp.ret === 0) {
          let info = resp.data.fault_info;
          if (info.deal_status) {
            info.deal_status_str = this.DealSteps.toString(info.deal_status);
          }
          if (info.fault_time) {
            info.fault_time_str = dayjs(info.fault_time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );
          }
          if (info.send_time) {
            info.send_time_str = dayjs(info.send_time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );
          }
          if (info.now_time) {
            info.now_time_str = dayjs(info.now_time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );
          }

          this.detailInfo = info;
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    //点击催单
    reminder() {
      let data = {
        is_reminder: 1, //参数
        fault_id: this.cardInfo.fault_id //故障id
      };
      faultSave(data).then(resp => {
        if (resp.ret === 0) {
          this.$toast({
            message: "已催单",
            duration: 2000
          });
          this.isReminder = true;
        } else if (resp.ret === -200330) {
          this.$toast({
            message: "已催单",
            duration: 2000
          });
          this.isReminder = true;
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
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
  padding-bottom: px2rem(34);
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
      // width: px2rem(100);
      font-size: px2rem(22);
      margin: 0 px2rem(8);
      display: inline-block;
    }

    .icon {
      img {
        width: px2rem(16);
        height: px2rem(20);
      }
    }
    .time-tw {
      font-size: px2rem(22);
    }
  }
  .time-str {
    width: px2rem(350);
  }
}
.btn-group {
  margin-top: px2rem(70);
  padding: 0 0 px2rem(44) px2rem(15);
  box-sizing: border-box;
  .lef-btn {
    margin-right: px2rem(40);
  }
}

.step-icon {
  img {
    width: px2rem(30);
    height: px2rem(30);
  }
}
.remark-content {
  margin-top: px2rem(10);
  padding-top: px2rem(20);
  padding-bottom: px2rem(20);
  border-top: px2rem(1) solid #e8e8e8;
  font-size: px2rem(32);
  color: #333333;
  img {
    width: px2rem(24);
    height: px2rem(18);
  }
  .remark-item {
    min-height: px2rem(40);
    line-height: px2rem(40);
    font-size: px2rem(28);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
  }
}
</style>
<style lang="scss">
.list-card {
  i.van-icon.van-icon-checked {
    color: #5a96dc !important;
  }
  .van-hairline.van-step.van-step--vertical.van-step--process {
    .van-step__title {
      color: #5a96dc !important;
      font-size: px2rem(28);
    }
  }
}
</style>
