<template>
    <div class="base-dialog-content">
        <div v-if="title" class="title">
            {{ title }}
        </div>
        <div class="content flex-box cross-center main-center">
            <span>{{ content }}</span>
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
    title: String,
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
.title {
  height: px2rem(88);
  line-height: px2rem(88);
  //   background: linear-gradient(90deg, $c-bg-orange-b, $c-bg-orange-a);
  color: #fff;
  font-size: px2rem(34);
  text-align: center;
}
.content {
  background: #fff;
  height: px2rem(195);
  font-size: px2rem(32);
  margin: 0 px2rem(57);
  color: #323232;
  text-align: center;
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


