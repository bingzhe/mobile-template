<template>
  <div class="opr-card">
    <div class="row__item vendor_num">设备编号： {{cardInfo.vendor_num}}</div>
    <div class="row__item address">地址：{{ cardInfo.addressStr }}</div>
    <div class="row__item">
      <div @click="handleOprBtnClick" class="v-button danger opr-btn">点击校准</div>
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
          vendor_id: "",
          vendor_num: "",
          addressStr: "" //地址
        };
      }
    }
  },
  methods: {
    handleOprBtnClick() {
      this.$emit("oprbtn-click");
    }
  }
};
</script>

<style lang="scss" scoped>
//卡片
.opr-card {
  box-shadow: 0px 0px 7px 0px rgba(51, 51, 51, 0.2);
  background: rgba(255, 255, 255, 1);
  border-radius: px2rem(20);
  font-size: px2rem(28);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #393939;
  padding: px2rem(32) px2rem(20);
}
.vendor_num {
  font-size: px2rem(32);
  margin-bottom: px2rem(18);
}
.address {
  font-size: px2rem(28);
  color: #999;
  margin-bottom: px2rem(30);
  line-height: 1.5;
}
.opr-btn {
  width: px2rem(170);
}
</style>
