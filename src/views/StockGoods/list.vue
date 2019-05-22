<template>
    <div id="vendor-goods-list">
        <base-header 
            head-title="商品库存"
        />
        <div class="gray-bg"></div>
        <div class="goods-title flex-box">
            <div class="goods-name item-grow">商品</div>
            <div class="goods-num flex-none">数量</div>
        </div>
        <div class="van-hairline--bottom"></div>        

        <div class="goods-content flex-box">
            <!-- 分类 -->
            <div class="goods-cate flex-none">
                <div 
                    v-for="cate in goodsList"
                    :key="cate.category_id"
                    class="cate-item"
                    :class="{
                        'active': currentCateId === cate.category_id
                    }"
                    @click="cateClickHandle(cate)"
                >
                    {{ cate.category_name }}({{cate.all_num}})
                    <div 
                        v-if="currentCateId === cate.category_id"
                        class="active-bar"
                    ></div>
                </div>
            </div>
            <!-- 商品 -->
            <div class="goods-list item-grow">
              <div 
                v-for="cate in goodsList"
                :key="cate.category_id"
              > 
                <div
                  v-if="currentCateId === cate.category_id"
                >
                  <div
                      class="goods-item"
                      v-for="goods in cate.goods_list"
                      :key="goods.goods_id"
                  >
                      <div class="flex-box">
                          <div class="goods-name item-grow">{{ goods.vendor_goods_name }} {{goods.goods_spec}}</div>
                          <div class="goods-stock-num flex-none">{{ goods.goods_stock }}</div>
                      </div>
                      <div class="van-hairline--bottom"></div>
                  </div> 
                </div>                 
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import { vendorGoodsGet } from "@/api/api.js";
import { errcode } from "@/config/cfg";
import { Public } from "@/config/public";

export default {
  components: {
    BaseHeader
  },
  data() {
    return {
      goodsList: [],

      currentCateId: "0"
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let data = {
        get_oa_goods: 1, //参数
        shop_id: Public.getShopid() //店铺id
      };

      // console.log("商品列表 req=>", data);
      vendorGoodsGet(data).then(resp => {
        // console.log("商品列表 res=>", resp);

        if (0 === resp.ret) {
          this.goodsList = resp.data.list || [];
          this.goodsList.map(cate => {
            if (cate.category_name === "全部") {
              cate.category_id = "0";
            }
            cate.goods_list = cate.goods_list || [];

            return cate;
          });
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    cateClickHandle(item) {
      this.currentCateId = item.category_id;
    }
  }
};
</script>

<style lang="scss" scoped>
#vendor-goods-list {
  margin-top: px2rem(88);
}
.gray-bg {
  height: px2rem(15);
  background: #f2f2f2;
}
.goods-title {
  padding-left: px2rem(180);
  box-sizing: border-box;
  height: px2rem(88);
  line-height: px2rem(88);
  background: #fff;
  font-size: px2rem(32);
  color: #323232;
  .goods-name {
    text-align: center;
  }
  .goods-num {
    width: px2rem(160);
    text-align: center;
  }
}
.goods-content {
  position: fixed;
  top: px2rem(192);
  bottom: 0;
  background: #fff;
  width: 100%;
}
.goods-cate {
  width: px2rem(180);
  height: 100%;
  background: #f2f2f2;
  overflow: auto;
}
.goods-list {
  height: 100%;
  overflow: auto;
}
.cate-item {
  position: relative;
  width: 100%;
  height: px2rem(88);
  line-height: px2rem(88);
  box-sizing: border-box;
  text-align: center;
  color: #393939;
  font-size: px2rem(28);

  &.active {
    background: #fff;
    color: #333333;
    font-weight: bold;
  }
  .active-bar {
    position: absolute;
    left: 0;
    top: px2rem(14);
    width: px2rem(6);
    height: px2rem(60);
    background: #5a96dc;
  }
}
.goods-item {
  width: 100%;
  height: px2rem(88);
  line-height: px2rem(88);
  font-size: px2rem(28);
  .goods-name {
    padding-left: px2rem(60);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: px2rem(385);
  }
  .goods-stock-num {
    width: px2rem(160);
    text-align: center;
  }
}
.van-hairline--bottom::after {
  border-color: rgba(138, 138, 138, 0.2);
}
</style>
