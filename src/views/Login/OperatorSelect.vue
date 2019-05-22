<template>
  <div id="operator-select">
    <div class="header">运营商</div>
    <div class="map">
      <ten-map-component @map-click="mapClickHandle"/>
    </div>
    <div class="operators">
      <div class="logo">
        <img class="logo-icon" src="@/assets/operator_logo.png">
      </div>
      <div class="name">{{name}}</div>
      <div class="shop-content">
        <div v-for="shop in shopList" :key="shop.shop_id">
          <div @click="loginShop(shop)" class="shop-item flex-box main-space cross-center">
            <span class="shop-name">{{shop.shop_name}}</span>
            <img class="right-icon" src="@/assets/right_gray.png">
          </div>
          <div class="van-hairline--bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TenMapComponent from "@/components/TenMap/index";
import TenMap from "@/config/map.js";
import { errcode } from "@/config/cfg";
import { loginSave } from "@/api/api";
import { Public } from "@/config/public";
import { mapState, mapMutations } from "vuex";
import { SHOP_K } from "@/components/Permission/index";

export default {
  components: {
    TenMapComponent
  },
  data() {
    return {
      shopList: [],
      name: "运营商",

      nextType: null,

      promiseList: [],
      pointList: []
    };
  },
  computed: {
    ...mapState({
      ACS: state => state.sysPermision
    })
  },
  created() {
    this.nextType = this.$route.query.type;

    const wxId = this.$route.query.wx_id;

    if (wxId) {
      window.Store.SetGlobalData("wxid", wxId);
    }

    this.getShopList();
  },
  methods: {
    ...mapMutations(["SET_MAPPOINTLIST"]),

    getShopList() {
      let userid = this.$route.query.userid;
      let platformid = this.$route.query.platform_id;

      if (userid) {
        Public.setUserid(userid);
      }

      let data = {
        get_employee: 1,
        userid: userid
      };

      if (platformid) {
        data.platform_id = platformid;
      }

      // console.log("店铺list =>req", data);
      loginSave(data).then(resp => {
        // console.log("店铺list =>res", resp);
        if (0 === resp.ret) {
          this.shopList = resp.data.shop_list;
          this.pointList = [];
          this.promiseList = [];

          if (this.shopList.length === 1) {
            this.loginShop(this.shopList[0]);
          }

          this.shopList.map(item => {
            let pointObj = {};

            let addressStr = `${item.province}${item.city}${item.area}${
              item.address
            }`;

            this.promiseList.push(TenMap.getPoint(addressStr));

            //地址转为经纬度
            TenMap.getPoint(addressStr).then(point => {
              pointObj.lat = point.lat;
              pointObj.lng = point.lng;
              pointObj.text = addressStr;
              this.pointList.push(pointObj);
            });

            Promise.all(this.promiseList).then(resp => {
              this.SET_MAPPOINTLIST({ mapPointList: this.pointList });
            });

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

    loginShop(shop) {
      let data = {
        get_shop: 1,
        userid: this.$route.query.userid,
        shop_id: shop.shop_id
      };

      // console.log("登录店铺 req =>", data);
      loginSave(data).then(resp => {
        // console.log("登录店铺 res =>", resp);
        if (0 === resp.ret) {
          let shopinfo = resp.data.shop_info || {};
          let employee = resp.data.employee;
          let platformer = resp.data.platformer;
          let shop_id = shopinfo.shop_id;
          let shop_name = shopinfo.shop_name;
          let shop_logo = shopinfo.shop_logo;

          let usename;

          if (employee) {
            usename = employee.real_name;
          }

          if (platformer) {
            usename = platformer.pl_name;
          }

          Public.setShopid(shop_id);
          Public.setUseName(usename);

          window.Store.SetGlobalData("shopname", shop_name);
          window.Store.SetGlobalData("shoplogo", shop_logo);

          //取权限判断，没有没有权限则进入首页

          this.$store.dispatch("getAccess").then(() => {
            switch (Number(this.nextType)) {
              case 1:
                if (!this.ACS[SHOP_K.ASSIS_HOME_REPLENISH]) {
                  this.$router.push("/");
                } else {
                  this.$router.push("/replenish");
                }
                break;
              case 2:
                if (!this.ACS[SHOP_K.ASSIS_HOME_REPAIR]) {
                  this.$router.push("/");
                } else {
                  this.$router.push("/repair");
                }
                break;
              case 3:
                if (!this.ACS[SHOP_K.ASSIS_HOME_ORDER]) {
                  this.$router.push("/");
                } else {
                  this.$router.push("/order");
                }
                break;
              case 4:
                if (!this.ACS[SHOP_K.ASSIS_HOME_DAMAGE]) {
                  this.$router.push("/");
                } else {
                  this.$router.push("/repairorder");
                }
                break;
              case 5:
                if (!this.ACS[SHOP_K.ASSIS_HOME_FORM]) {
                  this.$router.push("/");
                } else {
                  this.$router.push("/dashboard");
                }
                break;
              default:
                this.$router.push("/");
                break;
            }
          });
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },

    mapClickHandle() {
      // let pointList = [];
      // this.promiseList = [];

      // this.shopList.forEach(item => {
      //   let pointObj = {};

      //   let addressStr = `${item.province}${item.city}${item.area}${
      //     item.address
      //   }`;

      //   this.promiseList.push(TenMap.getPoint(addressStr));

      //   //地址转为经纬度
      //   TenMap.getPoint(addressStr).then(point => {
      //     pointObj.lat = point.lat;
      //     pointObj.lng = point.lng;
      //     pointObj.text = addressStr;
      //     pointList.push(pointObj);
      //   });
      // });

      // Promise.all(this.promiseList).then(resp => {
      //   this.SET_MAPPOINTLIST({ mapPointList: pointList });

      // });
      this.$router.push("/map");
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: px2rem(88);
  line-height: px2rem(88);
  text-align: center;
  color: #333333;
  font-size: px2rem(36);
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.04);
}
.map {
  height: px2rem(380);
}

.operators {
  margin: px2rem(24) px2rem(20) 0;
  border-radius: px2rem(20);
  padding: px2rem(32) px2rem(20) px2rem(80);
  box-shadow: 0px 0px 7px 0px rgba(51, 51, 51, 0.2);

  .logo {
    text-align: center;
    .logo-icon {
      width: px2rem(140);
      height: px2rem(140);
    }
  }
  .name {
    margin: px2rem(23) 0 px2rem(18);
    text-align: center;
    font-size: px2rem(32);
  }

  .shop-item {
    height: px2rem(88);
    line-height: px2rem(88);
    font-size: px2rem(28);
    padding-left: px2rem(10);
    .right-icon {
      width: px2rem(15);
      height: px2rem(28);
    }
  }
}
.van-popup--right {
  width: 100%;
  height: 80%;
}
</style>

