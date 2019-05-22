<template>
    <div class="goods-item flex-box">
        <div class="goods-img">
            <img 
              v-if="goodsInfo.goods_img_str" 
              class="img" 
              :src="base_url + '/img_get.php?img=1&height=240&width=240&imgname=' + goodsInfo.goods_img_str"  />
            <img v-else src="@/assets/good-default.png" class="img" />
        </div>
        <div class="goods-info item-grow flex-box flex-direction main-space">
            <span class="goods-name">{{ goodsInfo.vendor_goods_name}}</span>
            <span class="goods-id">{{ goodsInfo.vendor_goods_id}}</span>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    goodsInfo: {
      type: Object,
      default: () => {
        return {
          goods_img_str: "",
          vendor_goods_name: "",
          vendor_goods_id: ""
        };
      }
    }
  },
  data() {
    return {
      base_url: process.env.VUE_APP_BASEURL
    };
  }
};
</script>

<style lang="scss" scoped>
.goods-item {
  padding: px2rem(14) px2rem(10);
}
.goods-img {
  width: px2rem(120);
  height: px2rem(120);
  margin-right: px2rem(33);
  .img {
    width: px2rem(120);
    height: px2rem(120);
    border-radius: px2rem(15);
  }
}
.goods-info {
  padding: px2rem(14) 0;
  .goods-name {
    font-size: px2rem(30);
    color: #333;
  }
  .goods-id {
    font-size: px2rem(28);
    color: #999;
  }
}
</style>


