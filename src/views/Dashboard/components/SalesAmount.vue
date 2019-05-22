<template>
  <div class="amount-box">
          <!-- amount-content -->
          <div class="amount-content">
              <div class="price">
             {{amountData.money||0 | numFixOne}}
              </div>
              <!-- 今日销售额 -->
              <div class="price-title gray-text">
                <span v-if="pickerIndex===3"> 
                  <span class="block-box"> {{pickerStartTime}}</span>
                  至
                  <span class="block-box"> {{pickerEndTime}}</span>
                 
                    销售额(元)
                   </span>
                <span v-else> {{pickerTitle[pickerIndex]}}销售额(元) </span>
                <span v-if="amountData.compare_money>=0">
                  <img src="@/assets/up_red.png" alt="">
                </span>
                 <span v-if="amountData.compare_money<0">
                  <img src="@/assets/down_red.png" alt="">
                </span>
                <span v-if="amountData.compare_money&&!isNaN(amountData.compare_money)"> {{amountData.compare_money||0 | numFixOne}}%</span>
                <span v-else>0%</span>
              </div>
              <!-- gray-line -->
               <div class="gray-line"></div>
                <div class="bottom-box flex-box main-space">
                  <div class="bottom-left">
                    <span class="left-item">{{amountData.num||0}}</span>
                    <span class="left-item gray-text">交易笔数（笔）</span>
                  </div>
                  <div class="r-border"></div>
                  <div class="bottom-left">
                    <span class="left-item">{{amountData.pre_money||0 | numFixOne}}</span>
                    <span class="left-item gray-text">人均金额（元）</span>
                  </div>
                </div>
          </div>

         
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: {
    amountData: {
      type: Object,
      default: () => {
        return {
          money: 24, //金额
          num: 3, //订单金额
          compare_money: 0, //金额人均
          pre_money: 8 //人均
        };
      }
    },
    pickerIndex: {
      type: Number,
      default: 0
    },
    beginTime: {
      type: String,
      default: ""
    },
    endTime: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pickerTitle: ["今日", "本周", "本月"]
    };
  },
  computed: {
    pickerStartTime() {
      if (this.beginTime && this.pickerIndex === 3) {
        let time = dayjs(this.beginTime).format("YYYY-MM-DD");
        return time;
      } else {
        return "";
      }
    },
    pickerEndTime() {
      if (this.endTime && this.pickerIndex === 3) {
        let time = dayjs(this.endTime).format("YYYY-MM-DD");
        return time;
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
//灰色字体
.gray-text {
  font-size: px2rem(28);
  color: #999999;
}

//销售额
.amount-content {
  width: px2rem(670);
  height: px2rem(239);
  padding-top: px2rem(94);

  .price {
    font-size: px2rem(48);
    color: #393939;
  }
  .price-title {
    margin-top: px2rem(26);
    img {
      width: px2rem(17);
      height: px2rem(29);
    }
  }
}
//灰色线
.gray-line {
  width: px2rem(670);
  height: px2rem(55);
  margin-left: px2rem(20);
  border-bottom: px2rem(1) solid rgba(232, 232, 232, 1);
}

.r-border {
  border-right: px2rem(1) solid #e8e8e8;
}
//底部
.bottom-box {
  font-size: px2rem(36);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  text-align: center;
  color: rgba(51, 51, 51, 1);
  padding-top: px2rem(20);
  box-sizing: border-box;
  .bottom-left {
    width: px2rem(320);
    .left-item {
      display: block;
    }
  }
}
</style>
