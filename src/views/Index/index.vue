<template>
  <div class="home-page">
    <base-header head-title="首页">
      <template slot="left">
        <img @click="layout" class="close-icon" src="@/assets/close.png">
      </template>
      <template slot="right">
        <img class="logo-icon" src="@/assets/tplogo.png">
      </template>
    </base-header>

    <div class="shop-info">
      <div class="shop__logo">
        <img
          v-if="shop_logo"
          class="img"
          :src="base_url + '/img_get.php?img=1&imgname=' + shop_logo"
        >
        <img v-else class="img" src="@/assets/default_logo.png">
      </div>
      <div class="shop__name">
        <span>{{ shop_name }}</span>
      </div>

      <img @click="goSelectShop" class="toggle-shop" src="@/assets/toggle_shop.png">
    </div>

    <div class="card-content flex-content">
      <div>
        <index-card
          v-for="(item, key) in cardList"
          :key="key"
          :key-name="key"
          :card-info="item"
          class="card-item"
          @click.native="cardClickHandle(item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import IndexCard from "@/components/IndexCard/index.vue";
import BaseHeader from "@/components/BaseHeader/index.vue";
import { vendorBoard } from "@/api/api";
import { errcode, VENDOR } from "@/config/cfg";
import { Public } from "@/config/public";
import { loginSave } from "@/api/api";
import { mapState, mapMutations } from "vuex";
import { SHOP_K, PL_K } from "@/components/Permission/index";

export default {
  components: {
    IndexCard,
    BaseHeader
  },
  data() {
    return {
      base_url: process.env.VUE_APP_BASEURL,

      shop_name: "",
      shop_logo: "",

      cardList: {
        add: {
          img: require("@/assets/add.png"),
          label: "补货",
          value: 0,
          path: "/replenish",
          access: SHOP_K.ASSIS_HOME_REPLENISH,
          placcess: PL_K.ASSIS_HOME_REPLENISH
        },
        repair: {
          img: require("@/assets/repair.png"),
          label: "现场维修",
          value: 0,
          path: "/repair",
          access: SHOP_K.ASSIS_HOME_REPAIR,
          placcess: PL_K.ASSIS_HOME_REPAIR
        },
        damage: {
          img: require("@/assets/damage.png"),
          label: "故障处理",
          value: 0,
          path: "/repairorder",
          access: SHOP_K.ASSIS_HOME_DAMAGE,
          placcess: PL_K.ASSIS_HOME_DAMAGE
        },
        order: {
          img: require("@/assets/order_manage.png"),
          label: "订单管理",
          value: 0,
          path: "/order",
          access: SHOP_K.ASSIS_HOME_ORDER,
          placcess: PL_K.ASSIS_HOME_ORDER
        },
        dashboard: {
          img: require("@/assets/dashboard.png"),
          label: "数据报表",
          value: 0,
          path: "/dashboard",
          access: SHOP_K.ASSIS_HOME_FORM,
          placcess: PL_K.ASSIS_HOME_FORM
        },
        record: {
          img: require("@/assets/record.png"),
          label: "我的记录",
          value: 0,
          path: "/record",
          access: SHOP_K.ASSIS_HOME_RECORD,
          placcess: PL_K.ASSIS_HOME_RECORD
        },
        vendor: {
          img: require("@/assets/vendor.png"),
          label: "所有设备",
          value: 0,
          path: "/vendor",
          access: SHOP_K.ASSIS_HOME_VENDOR,
          placcess: PL_K.ASSIS_HOME_VENDOR
        },
        // oprset: {
        //   img: require("@/assets/vendor.png"),
        //   label: "运营配置",
        //   value: 0,
        //   path: "/oprset",
        //   access: SHOP_K.ASSIS_HOME_OPRSET,
        //   placcess: PL_K.ASSIS_HOME_OPRSET
        // }
      }
    };
  },
  computed: {
    ...mapState({
      ACS: state => state.sysPermision,
      isCuihui: state => state.isCuihui
    })
  },
  created() {
    this.shop_name = window.Store.GetGlobalData("shopname");
    this.shop_logo = window.Store.GetGlobalData("shoplogo");
    this.getInfo();

    /**
     * 运营配置只给萃会开放入口
     */
    if (this.isCuihui) {
      const oprset = {
        img: require("@/assets/vendor.png"),
        label: "运营配置",
        value: 0,
        path: "/oprset",
        access: SHOP_K.ASSIS_HOME_OPRSET,
        placcess: PL_K.ASSIS_HOME_OPRSET
      };

      this.cardList.oprset = oprset;
    }
  },
  methods: {
    ...mapMutations(["SET_SYSPERMISION"]),
    getInfo() {
      let data = {
        get_home_data: 1, //参数
        shop_id: Public.getShopid() //店铺id
      };

      // console.log("首页数据 req=>", data);
      vendorBoard(data).then(resp => {
        // console.log("首页数据 res=>", resp);
        if (0 === resp.ret) {
          let info = resp.data.data || {};
          this.cardList.add.value = info.out_num;
          this.cardList.repair.value = info.scene_num;
          this.cardList.damage.value = info.stock_deal;
          this.cardList.order.value = info.order_num;
          // this.cardList.dashboard.value = info.data_num;
          this.cardList.vendor.value = info.vendor_num;
          this.cardList.record.value = info.my_record_num;
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

      this.$router.push(card.path);
    },
    layout() {
      /**
       * 平台账户需要给后台传platform_id
       */
      const platformid = Public.getPlatformid();
      const wxid = window.Store.GetGlobalData("wxid");

      let data = {
        logout: 1
      };
      if (platformid) {
        data.platform_id = platformid;
      }
      if (wxid) {
        data.weixin_id = wxid;
      }


      // console.log("退出登录 req=>", data);
      loginSave(data).then(resp => {
        // console.log("退出登录 res=>", resp);
        if (0 === resp.ret) {
          Public.delShopid();
          Public.delUserid();
          Public.delPlatformid();
          Public.delUseName();
          this.SET_SYSPERMISION({ sysPermision: {} });
          this.$router.push({
            path: "/login"
          });
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    goSelectShop() {
      // if (!this.ACS[SHOP_K.ASSIS_HOME_TOGGLE]) {
      //   this.$toast({ message: "操作权限不足", duration: 2000 });
      //   return;
      // }
      let platformid = Public.getPlatformid();
      let userid = Public.getUserid();

      let queryObj = {
        userid: userid
      };

      if (platformid) {
        queryObj.platform_id = platformid;
      }

      this.$router.push({
        path: "/operators",
        query: queryObj
      });
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
    margin-top: px2rem(26);
    font-size: px2rem(50);
    color: #333333;
    font-weight: 400;
  }
  .toggle-shop {
    position: absolute;
    width: px2rem(40);
    height: px2rem(30);
    top: px2rem(32);
    right: px2rem(40);
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
.close-icon {
  width: px2rem(30);
  height: px2rem(30);
}
.logo-icon {
  width: px2rem(114);
  height: px2rem(44);
  position: relative;
  left: px2rem(-30);
}
</style>


