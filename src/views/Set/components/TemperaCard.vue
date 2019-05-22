<template>
    <div class="tempera-card">
        <div class="card__icon">
            <img v-if="cardInfo.active" src="@/assets/tem-select.png" />
            <img v-else src="@/assets/tem-noselect.png" />
        </div>
        <div class="card__info">
            <div class="vendor__num">设备编号：{{ cardInfo.vendor_num }}</div>
            <div class="vendor__address">地址：{{ cardInfo.addressStr }}</div>
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
          addressStr: "", //地址
          active: true
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tempera-card {
  box-shadow: 0px 0px 7px 0px rgba(51, 51, 51, 0.2);
  background: rgba(255, 255, 255, 1);
  border-radius: px2rem(20);
  font-size: px2rem(28);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #393939;
  padding: px2rem(32) px2rem(20);
  display: flex;
}
.card__icon {
  width: px2rem(80);
  flex: none;

  img {
    width: px2rem(60);
    height: px2rem(60);
  }
}
.vendor__num {
  font-size: px2rem(32);
  margin-bottom: px2rem(18);
}
.vendor__address {
  font-size: px2rem(28);
  color: #999;
  line-height: 1.4;
}
</style>

