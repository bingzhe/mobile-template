<template>
        <div class="search-content flex-box">
            <div 
              class="loca-content flex-box flex-none main-center  cross-center" 
              @click="goToMap"
            >
                <span class="label">深圳</span>
                <img 
                  class="loca-icon" 
                  src="@/assets/location_blue.png" 
                />
            </div>
            <div class="search-input item-grow flex-box cross-center">
                <input v-model="searchValue" type="text">
                <span class="search-icon flex-box cross-center" @click="onSearch">
                    <img src="@/assets/search.png" />
                </span>
            </div>
            <div 
              class="sort-content main-center flex-none flex-box cross-center" 
              @click="getScreenBox"
            >
                  <img 
                    class="sort-icon"
                    src="@/assets/screen.png"
                  />
            </div>
        </div>
</template>

<script>
export default {
  data() {
    return {
      searchValue: ""
    };
  },
  methods: {
    //搜索
    onSearch() {
      this.$emit("on-search", this.searchValue);
    },
    //进入地图
    goToMap() {
      this.$emit("map-click");
    },
    //打开筛选盒子
    getScreenBox() {
      this.$emit("getScreenBox");
    }
  }
};
</script>
<style lang="scss" scoped>
.search-content {
  font-size: px2rem(30);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(57, 57, 57, 1);
  height: px2rem(88);
  line-height: px2rem(88);
  background: rgba(241, 241, 241, 1);
  .loca-content {
    width: px2rem(126);
    box-sizing: border-box;
    text-align: center;
  }
  .sort-content {
    width: px2rem(54);
    margin-right: px2rem(14);
    box-sizing: border-box;
  }
  .sort-icon {
    width: px2rem(29);
    height: px2rem(33);
  }
  .loca-icon {
    width: px2rem(28);
    height: px2rem(35);
    margin-left: px2rem(5);
    position: relative;
    top: px2rem(-4);
  }

  .search-input {
    position: relative;
    input {
      box-sizing: border-box;
      padding: 0 px2rem(10);
      width: px2rem(550);
      // width: 100%;
      height: px2rem(58);
      background: rgba(255, 255, 255, 1);
      border-radius: px2rem(10);
      border: px2rem(1) solid #f1f1f1;
    }
    .search-icon {
      position: absolute;
      right: px2rem(10);
      top: px2rem(30);
      img {
        width: px2rem(30);
        height: px2rem(30);
      }
    }
  }
}
</style>
