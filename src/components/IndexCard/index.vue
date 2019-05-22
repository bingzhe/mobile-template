<template>
    <div class="display-card">
        <div class="card__img">
            <img class="img" :src="cardInfo.img" />
        </div>
        <div class="card__info">
            <span class="card__label">{{ cardInfo.label }}</span>
            <span v-if="keyName != 'dashboard' && keyName != 'oprset'" class="card__value">：{{ cardInfo.value }}</span>
        </div>
    </div>
</template>

<script>
/**
 * 首页和补货页面的卡片
 */

export default {
  props: {
    keyName: String,
    cardInfo: {
      type: Object,
      default: () => {
        return {
          img: require("@/assets/add.png"),
          label: "补货",
          value: "12"
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.display-card {
  display: inline-block;
  width: px2rem(315);
  height: px2rem(235);
  background: url("../../assets/card_bg.png") no-repeat;
  background-size: cover;

  .card__img {
    text-align: center;
    font-size: 0;
    margin-top: px2rem(40);
    margin-bottom: px2rem(24);
    .img {
      width: px2rem(82);
      height: px2rem(82);
    }
  }
  .card__info {
    text-align: center;
    font-size: px2rem(36);
    color: #333333;
  }
}
</style>

