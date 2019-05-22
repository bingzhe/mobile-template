<template>
    <div 
        class="header flex-box cross-center"
        :class="{'border-gray': showBorder}"
    >
        <div class="h-left">
            <slot name="left">
                <img 
                  @click="goBack"
                  class="back icon" 
                  src="@/assets/back.png" 
                />
            </slot>
        </div>

        <div class="h-center item-grow">
            <slot name="center">
                <span>{{ headTitle }}</span>
            </slot>
        </div>

        <div class="h-right">
            <slot name="right">
                <img 
                  @click="goHome"
                  class="home icon" 
                  src="@/assets/home.png" 
                />
            </slot> 
        </div>
               
    </div>
</template>

<script>
export default {
  props: {
    showBorder: {
      type: Boolean,
      default: true
    },
    headTitle: {
      type: String,
      default: ""
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  height: px2rem(88);
  box-sizing: border-box;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.04);
}
// .border-gray {
//   border-bottom: 1px solid #e7e7e7;
// }
.h-left,
.h-right {
  width: px2rem(122);
  text-align: center;
}
.h-center {
  text-align: center;
  font-size: px2rem(36);
}
.back.icon {
  width: px2rem(18);
  height: px2rem(34);
}
.home.icon {
  width: px2rem(60);
  height: px2rem(53);
}
</style>


