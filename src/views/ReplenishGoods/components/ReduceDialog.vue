<template>
    <div class="reduce-goods-dialog">
        <div class="title flex-box cross-center">
            <span @click="cancelClickHandle">取消</span>
            <span class="title--gary">货道减货</span>
            <span class="title--gary">货道存量：{{aisleInfo.goods_num}}</span>
        </div>
        <div class="van-hairline--bottom"></div>
        <div class="content">
            <div class="goods_img">
                <img 
                    v-if="aisleInfo.goods_img_str"
                    class="img"
                    :src="base_url + '/img_get.php?img=1&height=560&width=560&imgname=' + aisleInfo.goods_img_str" 
                />                
                <img 
                    v-else 
                    class="img" 
                    src="@/assets/aisle_default_goods.png" 
                />
            </div>
            <div class="goods_name">{{aisleInfo.goods_name}}</div>
            <div class="goods_step flex-box main-center">
              <v-stepper 
                v-model="stepperValue"
                :max="aisleInfo.goods_num"
              />
            </div>
        </div>
        <div class="button">
            <div 
                class="v-button large-round"
                @click="reduceGoodsHandle"
            >确认减货</div>
        </div>
    </div>
</template>

<script>
import VStepper from "./Stepper";

export default {
  props: {
    aisleInfo: {
      type: Object,
      default: () => {
        return {
          aisle_id: "",
          goods_name: "", //商品名称
          aisle_name: "", //货道名称
          goods_img_str: "",
          goods_num: 3, //货道库存数
          aisle_capacity: 8 //货到容量
        };
      }
    }
  },
  components: {
    VStepper
  },
  data() {
    return {
      base_url: process.env.VUE_APP_BASEURL,

      stepperValue: 0
    };
  },
  created() {
    this.stepperValue = this.aisleInfo.goods_num;
  },
  watch: {
    aisleInfo: {
      handler: function() {
        this.stepperValue = this.aisleInfo.goods_num;
      },
      deep: true
    }
  },
  methods: {
    reduceGoodsHandle() {
      this.$emit("reduce-opr", this.stepperValue);
    },
    cancelClickHandle() {
      this.$emit("on-cancel");
    }
  }
};
</script>

<style lang="scss" scoped>
.reduce-goods-dialog {
  width: px2rem(750);
  padding: 0 px2rem(19);
  box-sizing: border-box;
}
.title {
  height: px2rem(98);
  span {
    width: 33.3%;
    font-size: px2rem(30);
    color: #393939;
    text-align: center;
  }
  span.title--gary {
    color: #999999;
  }
  span:first-child {
    text-align: left;
  }
  span:last-child {
    text-align: right;
  }
}
.content {
  padding: px2rem(46) 0 px2rem(74);
  .goods_img {
    text-align: center;
    margin-bottom: px2rem(35);
    .img {
      width: px2rem(280);
      height: px2rem(280);
    }
  }
  .goods_name {
    text-align: center;
    color: #333333;
    font-size: px2rem(30);
    margin-bottom: px2rem(53);
  }
  .goods_step {
    height: px2rem(60);
  }
}
.button {
  text-align: center;
  margin-bottom: px2rem(90);
}
</style>


