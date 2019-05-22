<template>
    <div class="home-page">
        <base-header 
            head-title="补货"
        />        

        <div class="shop-info">
            <div class="shop__logo">
                <img  
                  v-if="shop_logo" 
                  class="img" 
                  :src="base_url + '/img_get.php?img=1&imgname=' + shop_logo"
                />              
                <img v-else class="img" src="@/assets/default_logo.png" />
            </div>        
            <div class="shop__name">
                <span>{{ shop_name }}</span>
            </div>    
        </div>

        <div class="card-content flex-content">
            <index-card 
                v-for="(item, key) in cardList"
                :key="key"
                :card-info="item"
                class="card-item"
                @click.native="cardClickHandle(item)"
            />
        </div>
    </div>
</template>

<script>
import IndexCard from "@/components/IndexCard/index.vue";
import BaseHeader from "@/components/BaseHeader/index.vue";
import { vendorBoard } from "@/api/api";
import { errcode, VENDOR } from "@/config/cfg";
import { Public } from "@/config/public";
import { SHOP_K, PL_K } from "@/components/Permission/index";
import { mapState } from "vuex";

export default {
  components: {
    IndexCard,
    BaseHeader
  },
  data() {
    return {
      base_url: process.env.VUE_APP_BASEURL,

      shop_name: "",

      cardList: {
        short: {
          img: require("@/assets/short.png"),
          label: "断货设备",
          value: 0,
          path: "/vendor",
          status: 4,
          access: SHOP_K.ASSIS_REPLE_SHORT,
          placcess: PL_K.ASSIS_REPLE_SHORT
        },
        break: {
          img: require("@/assets/break.png"),
          label: "缺货设备",
          value: 0,
          path: "/vendor",
          status: 3,
          access: SHOP_K.ASSIS_REPLE_LACK,
          placcess: PL_K.ASSIS_REPLE_LACK
        },
        stock: {
          img: require("@/assets/stock.png"),
          label: "商品库存",
          value: 0,
          path: "/stockgoods",
          access: SHOP_K.ASSIS_REPLE_STOCK,
          placcess: PL_K.ASSIS_REPLE_STOCK
        },
        return: {
          img: require("@/assets/return.png"),
          label: "退货",
          value: 0,
          path: "/returngoods",
          access: SHOP_K.ASSIS_REPLE_RETURN,
          placcess: PL_K.ASSIS_REPLE_RETURN
        },
        record: {
          img: require("@/assets/record.png"),
          label: "我的记录",
          value: 0,
          path: "/record",
          access: SHOP_K.ASSIS_REPLE_RECORD,
          placcess: PL_K.ASSIS_REPLE_RECORD
        }
      }
    };
  },
  computed: {
    ...mapState({
      ACS: state => state.sysPermision
    })
  },
  created() {
    this.shop_name = window.Store.GetGlobalData("shopname");
    this.shop_logo = window.Store.GetGlobalData("shoplogo");
    this.getInfo();
  },
  methods: {
    getInfo() {
      let data = {
        get_repl_data: 1, //参数
        shop_id: Public.getShopid() //店铺id
      };

      // console.log("补货首页数据 req=>", data);
      vendorBoard(data).then(resp => {
        // console.log("补货首页数据 res=>", resp);
        if (0 === resp.ret) {
          let info = resp.data.data || {};
          this.cardList.short.value = info.out_num;
          this.cardList.break.value = info.stock_num;
          this.cardList.stock.value = info.goods_num;
          this.cardList.return.value = info.return_num;
          this.cardList.record.value = info.record_all_num;
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    cardClickHandle(card) {
      const shopid = Public.getShopid();

      if (shopid === VENDOR.shop_id) {
        if (!this.ACS[card.placcess]) {
          this.$toast({ message: "操作权限不足", duration: 2000 });
          return;
        }
      } else {
        if (!this.ACS[card.access]) {
          this.$toast({ message: "操作权限不足", duration: 2000 });
          return;
        }
      }

      if (card.status) {
        this.$router.push({
          path: card.path,
          query: {
            status: card.status
          }
        });
      } else {
        this.$router.push(card.path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  margin-top: px2rem(88);
}
.shop-info {
  position: relative;
  padding: px2rem(30) 0 px2rem(45);
  .shop__logo {
    text-align: center;
    .img {
      width: px2rem(180);
      height: px2rem(180);
    }
  }
  .shop__name {
    text-align: center;
    font-size: px2rem(50);
    margin-top: px2rem(26);
    color: #333333;
    font-weight: 400;
  }
}
.card-content {
  padding: 0 px2rem(40);
}

.card-item {
  margin-bottom: px2rem(24);
}
.card-item:nth-child(odd) {
  margin-right: px2rem(35);
}
</style>


