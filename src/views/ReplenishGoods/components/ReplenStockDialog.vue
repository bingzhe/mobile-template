<template>
    <div class="base-dialog-content">
        <div class="content">
            <div class="content-text">
                <span>{{ content }}</span>
            </div>
            
            <div class="tip">
                继续补货，只能补库存足够的商品
            </div>
        </div>
        <div class="footer flex-box">
            <div 
                @click="cancelHandler"
                class="cancel-btn item-grow"
            >否</div>
            <div 
                @click="confirmHandler"
                class="confirm-btn item-grow"
            >是</div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    content: String
  },
  methods: {
    cancelHandler() {
      this.$emit("on-cancel");
    },
    confirmHandler() {
      this.$emit("on-confirm");
    }
  }
};
</script>

<style lang="scss" scoped>
.base-dialog-content {
  // @include wh(px2rem(568), px2rem(374));
  width: px2rem(588);
  padding: 0 px2rem(12);
  box-sizing: border-box;
}
.content {
  box-sizing: border-box;
  background: #fff;
  height: px2rem(195);
  font-size: px2rem(32);
  margin: 0 px2rem(57);
  padding: px2rem(34) 0;
  color: #323232;
  text-align: center;
  .content-text {
    line-height: 1.2;
  }
}
.tip {
  font-size: px2rem(24);
  color: #999999;
  text-align: center;
  margin: px2rem(26) 0 0;
}
.footer {
  background: #fff;
  box-sizing: border-box;
  border-top: 1px solid #ededed;
  height: px2rem(90);
  font-size: px2rem(34);
  div {
    line-height: px2rem(90);
    text-align: center;
  }
  .cancel-btn {
    color: $v-blue;
    border-right: 1px solid #ededed;
  }
  .confirm-btn {
    color: 323232;
  }
}
</style>


