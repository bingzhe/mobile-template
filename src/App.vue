<template>
  <div id="app">
    <div 
      class="load-console-btn"
      @click="openDebugBox"
    ></div>
    <router-view/>
  </div>
</template>

<script>
import Util from "@/config/util.js";

export default {
  data() {
    return {
      debug_click_count: 0,
      debug_click_time: 0
    };
  },
  methods: {
    openDebugBox() {
      if (undefined !== window.VConsole) {
        return;
      }
      if (Date.now() - this.debug_click_time > 3000) {
        this.debug_click_count = 0;
        this.debug_click_time = Date.now();
      }
      this.debug_click_count++;
      if (5 === this.debug_click_count) {
        this.debug_click_count = -1;
        Util.LoadJs(
          "http://platform.jzzwlcm.com/static/vconsole.min.js",
          () => {
            new VConsole();
          }
        );
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: px2rem(30);
  color: #323232;
}
.load-console-btn {
  position: fixed;
  z-index: 2001;
  top: 0;
  left: px2rem(120);
  width: px2rem(100);
  height: px2rem(88);
}
</style>
