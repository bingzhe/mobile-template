<template>
  <div class="chart-line">
    <div class="select-input">
      <span class="title-line" v-if="changeIndex==0">单位（ 笔 ）</span>
      <span class="title-line" v-else>单位（ 元 ）</span>
      <van-collapse v-model="activeName" accordion class="select-box">
        <van-collapse-item :title="activeTitle" name="1">
          <div
            class="option-item"
            @click="changeSelect(item)"
            v-for="item in option"
            :key="item.value"
            :class="{'active':changeIndex==item.value}"
          >{{item.label}}</div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <my-line :numList="lineData" :activeTitle="activeTitle" :changeIndex="changeIndex"/>
  </div>
</template>

<script>
import MyLine from "./child/MyLine.vue";
export default {
  props: {
    lineData: {
      type: Array,
      default: () => {
        return [
          // {
          //   date: "2017-06-05",
          //   value: 0
          // },
          // {
          //   date: "2017-06-06",
          //   value: 0
          // },
          // {
          //   date: "2017-06-07",
          //   value: 0
          // },
          // {
          //   date: "2017-06-08",
          //   value: 0
          // }
        ];
      }
    }
  },
  data() {
    return {
      activeName: "",
      activeTitle: "销售量",
      changeIndex: 0,
      option: [
        {
          label: "销售量",
          value: 0
        },
        {
          label: "销售额",
          value: 1
        }
      ]
    };
  },
  components: {
    MyLine
  },
  methods: {
    changeSelect(item) {
      this.changeIndex = item.value;
      this.activeTitle = item.label;
      this.$emit("sales-or-amount", this.changeIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
.title-line {
  padding-left: px2rem(34);
  font-size: px2rem(28);
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.select-input {
  padding-top: px2rem(49);
  padding-right: px2rem(34);
  height: px2rem(50);
  line-height: px2rem(50);
}
.select-box {
  font-size: px2rem(28);
  color: #323232;
  width: px2rem(160);
  height: px2rem(50);
  border: px2rem(2) solid rgba(216, 216, 216, 1);
  border-radius: px2rem(8);
  box-sizing: border-box;
}
.option-item {
  box-sizing: border-box;
  color: #5a96dc;
  font-size: px2rem(26);
  width: px2rem(155);
  height: px2rem(50);
  line-height: px2rem(50);
  text-align: center;
  background: rgba(255, 255, 255, 1);
  border: px2rem(1) solid rgba(90, 150, 220, 1);
  &:last-of-type {
    border-top: 0;
  }
}
.option-item.active {
  background: #5a96dc;
  color: #fff;
}
</style>

<style lang="scss">
.chart-line {
  position: relative;
  .van-collapse {
    position: absolute;
    right: px2rem(34);
    top: px2rem(50);
  }
  .van-cell {
    padding: 0;
    padding-left: px2rem(22);
  }
  .van-collapse-item__content {
    padding: 0;
  }
}
</style>
