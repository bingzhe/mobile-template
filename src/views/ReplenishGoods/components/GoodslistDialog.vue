<template>
    <div class="goods-list-dialog">
        <div class="title flex-box cross-center main-space">
          <div class="cancel--left">
            <span class="cancel-button">取消</span>
          </div>
          <div class="search-input">
            <input 
              class="search-input__inner" 
              type="text"
              v-model="goodsName"
              placeholder="搜索商品名称、商品编码"
            />
            <span @click="getList" class="search-icon flex-cont flex-info-center">
                <img src="@/assets/search.png" />
            </span>
          </div>
          <div @click="openScanQRCode" class="icon-content">
             <img class="code-img" src="@/assets/goods_code.png" />
          </div>
            
        </div>
        <div class="van-hairline--bottom"></div>        
        <div class="list-content">
            <div v-for="item in list" :key="item.vendor_goods_id">
                <goods-item 
                    :goods-info="item"
                    @click.native="goodsClickHandle(item)"
                />  
                <div class="van-hairline--bottom"></div>                    
            </div>
        </div>
    </div>
</template>

<script>
import GoodsItem from "./GoodsItem.vue";
import WxConfig from "@/config/wxConfig";
import { vendorGoodsGet } from "@/api/api";
import { Public } from "@/config/public";
import { errcode } from "@/config/cfg";

export default {
  components: {
    GoodsItem
  },
  data() {
    return {
      list: [],
      vendor_id: "",
      goodsName: ""
    };
  },
  created() {
    this.vendor_id = this.$route.query.vendorid || "";

    this.getList();
  },
  methods: {
    getList() {
      let data = {
        get_goods_list: 1,
        shop_id: Public.getShopid(),
        vendor_id: this.vendor_id,
        sale_off: 0,
        page_size: 999,
        page_no: 1
      };

      //商品名称编号搜索
      if (this.goodsName) {
        data.search_code = this.goodsName;
      }

      vendorGoodsGet(data).then(resp => {
        // console.log(resp);
        if (resp.ret === 0) {
          this.list = resp.data.goods_list;

          this.list.map(item => {
            item.goods_img_str = (item.goods_img_list || [])[0] || "";

            return item;
          });
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    goodsClickHandle(item) {
      this.$emit("on-goods-click", item);
    },
    async openScanQRCode() {
      let codestr = await WxConfig.scanQRCode();

      this.goodsName = codestr;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-list-dialog {
  height: px2rem(854);
  width: px2rem(750);
  padding: 0 px2rem(24);
  box-sizing: border-box;
}
.title {
  // position: absolute;
  // top: 0;
  // width: px2rem(700);
  height: px2rem(100);
  color: #393939;
  font-size: px2rem(30);
  .cancel--left {
    width: px2rem(75);
  }
  .icon-content {
    width: px2rem(75);
    text-align: right;
    .code-img {
      width: px2rem(45);
      height: px2rem(37);
    }
  }
}
.search-input {
  position: relative;
  margin: 0 px2rem(14) 0 px2rem(12);
  .search-input__inner {
    width: px2rem(550);
    height: px2rem(58);
    background: #f1f1f1;
    border-radius: px2rem(10);
    border: px2rem(1) solid #f1f1f1;
    padding-left: px2rem(68);
    box-sizing: border-box;
  }
  .search-icon {
    position: absolute;
    left: px2rem(20);
    top: px2rem(14);
    img {
      width: px2rem(30);
      height: px2rem(30);
    }
  }
}
.list-content {
  height: px2rem(753);
  overflow-y: auto;
}
</style>

