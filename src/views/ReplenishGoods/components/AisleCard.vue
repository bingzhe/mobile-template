<template>
  <div class="aisle-card">
    <div v-if="aisleInfo.is_set === 0" class="aisle-noset flex-box">
      <div class="aisle__img flex-none">
        <img class="img" src="@/assets/aisle_default_goods.png">
      </div>
      <div class="aisle__info item-grow">
        <div class="aisle__name">
          <span>货道：</span>
          <!-- 优先显示别名 -->
          <span>{{aisleInfo.aisle_nickname || aisleInfo.aisle_name}}</span>
        </div>
        <div class="aisle__cap">
          <span>货道容量：</span>
          <span>{{aisleInfo.aisle_capacity}}</span>
        </div>
        <div class="aisle__button">
          <div class="v-button" @click="addNewClickHandle">配置商品</div>
        </div>
      </div>
    </div>
    <div v-if="aisleInfo.is_set === 1" class="aisle-set flex-box">
      <div class="aisle__img flex-none">
        <img
          v-if="aisleInfo.goods_img_str"
          class="img"
          :src="base_url + '/img_get.php?img=1&height=512&width=360&imgname=' + aisleInfo.goods_img_str"
        >
        <img class="img" v-else src="@/assets/aisle_default_goods.png">
      </div>
      <div class="aisle__info item-grow">
        <div class="aisle__name">
          <span>货道：</span>
          <span>{{aisleInfo.aisle_nickname || aisleInfo.aisle_name}}</span>
        </div>
        <div class="aisle__goods_name">
          <span>{{ aisleInfo.goods_name }}</span>
        </div>
        <div class="aisle__goods_stock">
          <span>商品库存：</span>
          <span>{{aisleInfo.goods_stock}}</span>
        </div>
        <div class="aisle__cap__display flex-box">
          <div
            v-for="item in aisleInfo.aisleCapList"
            :key="item.value"
            class="cap__item flex-box cross-center main-center"
            :class="{
                          'cap__item--empty': item.status === AisleCapStatus.EMPTY,
                          'cap__item--active': item.status === AisleCapStatus.HASGOODS,
                          'cap__item--able': item.status === AisleCapStatus.ADDSELECT,
                          'cap__item--warning':  item.status === AisleCapStatus.STOCKSHORT,
                      }"
            @click="capItemClickHandle(item)"
          >
            <span>{{ item.value }}</span>
          </div>
        </div>
      </div>
      <div class="aisle__button flex-none flex-box flex-direction main-space">
        <div class="v-button small" @click="toggleClickHandle">更换</div>
        <div class="v-button danger small" @click="saleoffClickHandle">下架</div>
        <div v-if="aisleInfo.goods_num" class="v-button warning small" @click="reduceClickHandle">减货</div>
        <div v-else class="v-button disabled small">减货</div>
      </div>
    </div>
  </div>
</template>

<script>
import { AisleCapStatus } from "@/config/cfg";

export default {
  props: {
    aisleInfo: {
      type: Object,
      default: () => {
        return {
          aisleCapList: [],
          is_set: 1,
          aisle_id: "",
          aisle_nickname: "", //货道别名
          aisle_name: "", //货道名称
          goods_name: "", //商品名称
          goods_spec: "", //商品规格
          goods_num: 3, //货道库存数
          aisle_capacity: 15, //货到容量
          goods_img: [
            //商品图片
            "aa682220d778f9130060d1ddb54d0d49.jpg"
          ],
          goods_img_str: "aa682220d778f9130060d1ddb54d0d49.jpg",
          goods_stock: 4 //商品库存<<<<<<<<<<<用与判断颜色显示
        };
      }
    }
  },
  data() {
    return {
      base_url: process.env.VUE_APP_BASEURL,
      AisleCapStatus
    };
  },
  methods: {
    capItemClickHandle(item) {
      this.$emit("cap-click", item);
    },
    toggleClickHandle() {
      this.$emit("on-toggle");
    },
    saleoffClickHandle() {
      this.$emit("on-saleoff");
    },
    reduceClickHandle() {
      this.$emit("on-reduce");
    },
    addNewClickHandle() {
      this.$emit("on-new");
    }
  }
};
</script>

<style lang="scss" scoped>
.aisle-card {
  padding: px2rem(20) px2rem(20) px2rem(34);
  box-shadow: 0px 0px 7px 0px rgba(51, 51, 51, 0.2);
  border-radius: px2rem(20);
}

.aisle-noset {
  .aisle__img {
    width: px2rem(180);
    height: px2rem(256);
    margin-right: px2rem(22);
    .img {
      width: px2rem(180);
      height: px2rem(256);
      border-radius: px2rem(16);
    }
  }
  .aisle__info {
    color: #393939;
    font-size: px2rem(28);
    font-weight: 500;
    .aisle__name {
      margin: px2rem(23) 0 px2rem(32);
    }
    .aisle__cap {
      margin-bottom: px2rem(40);
    }
  }
}
.aisle-set {
  .aisle__img {
    width: px2rem(180);
    height: px2rem(256);
    margin-right: px2rem(22);
    .img {
      width: px2rem(180);
      height: px2rem(256);
      border-radius: px2rem(16);
    }
  }
  .aisle__info {
    color: #393939;
    font-size: px2rem(28);
    font-weight: 500;
    max-width: px2rem(385);
    .aisle__name {
      margin: px2rem(20) 0 px2rem(37);
    }
    .aisle__goods_name {
      margin-bottom: px2rem(31);
    }
    .aisle__goods_stock {
      margin-bottom: px2rem(36);
    }
    .aisle__cap__display {
      flex-wrap: wrap;
    }
  }
  .aisle__button {
    width: px2rem(100);
    height: px2rem(256);
  }
}

.cap__item {
  box-sizing: border-box;
  height: px2rem(50);
  width: px2rem(50);
  border-radius: px2rem(6);
  margin-right: px2rem(20);
  margin-bottom: px2rem(20);
  color: #333;
  background: #e4e5e7;
}

.cap__item--empty {
  color: #333;
  background: #e4e5e7;
}
.cap__item--active {
  color: #fff;
  background: $v-blue;
}
.cap__item--able {
  color: #fff;
  background: #ff6f06;
}
.cap__item--warning {
  color: #fff;
  background: rgba(255, 111, 6, 0.4);
}
</style>


