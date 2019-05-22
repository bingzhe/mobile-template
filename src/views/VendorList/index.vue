<template>
  <div id="vendor-list">
    <base-header head-title="设备列表"/>

    <base-search
      class="base-search"
      @on-search="handleSearchClick"
      @getScreenBox="openSortDialog"
      @map-click="mapiconClickHandle"
    />

    <div class="vendor-list-content">
      <vendor-card
        v-for="(vendor, index) in vendorList"
        :key="vendor.vendor_id"
        :card-info="vendor"
        :distance-info="vendorDistanceList[index]"
        class="vendor-card"
        @on-replenish="goReplenishHandle(vendor)"
        @on-normal="goReplenishHandle(vendor)"
        @name-click="handleNameClick(vendor)"
        @on-short="handleShortClick(vendor)"
        @on-damage="goDamageList"
      />
    </div>

    <van-popup
      class="change-default-dailog-custom"
      v-model="showSortDialog"
      @click-overlay="sortDialogCancelClick"
      position="bottom"
    >
      <sort-dialog @on-cancel="sortDialogCancelClick" @on-confirm="sortDialogConfirmClick"/>
    </van-popup>
  </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import BaseSearch from "@/components/BaseSearch/index.vue";
import VendorCard from "@/components/VendorCard/index.vue";
import SortDialog from "./components/SortDialog.vue";
import { vendorGet, vendorSave } from "@/api/api";
import { VendorStatus, errcode } from "@/config/cfg";
import TenMap from "@/config/map.js";
import WxConfig from "@/config/wxConfig";
import { Public } from "@/config/public";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    BaseHeader,
    BaseSearch,
    VendorCard,
    SortDialog
  },
  data() {
    return {
      vendorList: [],
      vendorPointList: [],
      promiseList: [],
      vendorDistanceList: [],
      vendor_status: null,
      locationPoint: { lat: 22.55329, lng: 113.88308 },

      // 排序弹窗
      showSortDialog: false,
      sortValue: 1
    };
  },
  computed: {
    ...mapState({
      wxSdkConfig: state => state.wxSdkConfig
    })
  },
  watch: {
    wxSdkConfig: function (val) {
      if (val) {
        this.calcuDistance();
      }
    }
  },
  created() {
    this.vendor_status = this.$route.query.status;
    // this.getVendorList();
  },
  mounted() {
    this.getVendorList();
  },
  methods: {
    ...mapMutations(["SET_MAPPOINTLIST"]),
    getVendorList(searchValue) {
      let data = {
        page_no: 1,
        page_size: 199,
        get_vendor_list: 1,
        shop_id: Public.getShopid()
      };

      if (this.vendor_status) {
        data.vendor_status = this.vendor_status;
      }

      if (searchValue) {
        data.vendor_name = searchValue;
      }

      //是否有排序
      if (this.sortValue) {
        data.sort = this.sortValue;
      }
      console.log("设备列表 req=>", data);
      vendorGet(data).then(resp => {
        console.log("设备列表 res=>", resp);

        if (0 === resp.ret) {
          this.vendorList = resp.data.vendor_list;

          this.vendorList.map(vendor => {
            let addressStr = `${vendor.province}${vendor.city}${vendor.area}${
              vendor.address
            }`;

            this.promiseList.push(TenMap.getPoint(addressStr));
            //地址转为经纬度
            TenMap.getPoint(addressStr).then(point => {
              this.vendorPointList.push(point);
              vendor.point = point;
            });

            //断货相同商品只显示只显示一条
            vendor.stockout_list = vendor.stockout_list || [];

            const stockoutList = vendor.stockout_list.filter(
              goods => !!goods.goods_num
            );
            //添加缺货货总数排序
            vendor.stockoutAllNum = stockoutList.length;

            const outStockoutList = vendor.stockout_list.filter(
              goods => !goods.goods_num
            );
            //添加断货总数排序
            vendor.outAllNum = outStockoutList.length;

            let outStockGoodsExist = [];

            outStockoutList.forEach(goods => {
              if (outStockGoodsExist.indexOf(goods.goods_id) === -1) {
                outStockGoodsExist.push(goods.goods_id);
                stockoutList.push(goods);
              }
            });
            vendor.stockout_list = stockoutList;

            return vendor;
          });

          if (this.wxSdkConfig) {
            this.calcuDistance();
          }
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    handleSearchClick(searchValue) {
      this.getVendorList(searchValue);
    },
    handleShortClick(vendor) {
      let stockoutList = vendor.stockout_list || [];

      // 断货商品id并去重
      let goodsIdList = [];
      stockoutList.forEach(goods => {
        let goodsId = goods.goods_id;

        if (!goods.goods_num && goodsIdList.indexOf(goodsId) === -1) {
          goodsIdList.push(goodsId);
        }
      });

      let data = {
        save_vendor_status: 1,
        vendor_id: vendor.vendor_id,
        goods_id_list: goodsIdList
      };
      // console.log("断货通知 req=>", data);
      vendorSave(data).then(resp => {
        // console.log("断货通知 res=>", resp);
        if (0 === resp.ret) {
          this.$toast({
            message: "已发送断货通知",
            duration: 2000
          });
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    handleNameClick(vendor) {
      if (
        vendor.vendor_status &&
        vendor.vendor_status !== VendorStatus.DAMAGE &&
        vendor.vendor_status !== VendorStatus.OFFLINE
      ) {
        this.goReplenishHandle(vendor);
      }
    },
    goReplenishHandle(vendor) {
      this.$router.push({
        path: "/replenish/handle",
        query: {
          vendorid: vendor.vendor_id,
          vendorname: vendor.vendor_name,
          vendornum: vendor.vendor_num
        }
      });
    },
    //定位
    getLocation() {
      return new Promise(resolve => {
        WxConfig.getLocation().then(point => {
          console.log("微信定位", point);
          this.locationPoint = point;
          resolve(point);
        });
      });
    },
    /**
     * 分钟转小时分钟
     */
    getDateDiff(val) {
      let hour = 60;

      let hourC = val / hour;

      let result;
      if (hourC >= 1) {
        let min = parseInt(val - parseInt(hourC) * 60);
        result = "" + parseInt(hourC) + "小时";
        if (min >= 1) {
          result = result + min + "分钟";
        }
      } else if (val >= 1) {
        result = "" + parseInt(val) + "分钟";
      } else {
        result = "1分钟";
      }
      return result;
    },

    /**
     * 计算距离
     */
    calcuDistance() {
      let pormiseLocation = this.getLocation();

      Promise.all([...this.promiseList, pormiseLocation]).then(resp => {
        this.vendorList.map(vendor => {
          let start = this.locationPoint;
          let end = vendor.point || {};
          console.log("vendor 设备", vendor.area + vendor.address);
          TenMap.getMapDistance(start, end)
            .then(resp => {
              let detail = resp.detail || {};
              console.log("suc 计算距离", detail);
              vendor.distance = detail.distance || 0;
              vendor.duration = detail.duration || 0;

              this.$set(vendor, "distanceStr", vendor.distance / 1000);
              this.$set(vendor, "timeStr", this.getDateDiff(vendor.duration));
            })
            .catch(err => {
              console.log("err 计算距离", err);
              vendor.distance = 0;
              vendor.duration = 0;
            });
        });
      });
    },

    //sort dialog
    openSortDialog() {
      this.showSortDialog = true;
    },
    sortDialogCancelClick() {
      this.showSortDialog = false;
    },
    sortDialogConfirmClick(val) {
      this.sortValue = val;
      /**
       * 距离前端排序
       */
      if (1 === this.sortValue) {
        this.vendorList.sort(this.distanceSortFuc);
      } else if (2 === this.sortValue) {
        // this.getVendorList();
        // this.calcuDistance();
        this.vendorList.sort((a, b) => {
          return b.stockoutAllNum - a.stockoutAllNum;
        });
      } else if (3 === this.sortValue) {
        this.vendorList.sort((a, b) => {
          return b.outAllNum - a.outAllNum;
        });
      }
      this.showSortDialog = false;
    },
    distanceSortFuc(a, b) {
      return a.distance - b.distance;
    },
    mapiconClickHandle() {
      let pointList = this.vendorList.map(vendor => {
        let addressStr = `${vendor.province}${vendor.city}${vendor.area}${
          vendor.address
        }`;

        let point = {};

        point.text = addressStr;
        point.lat = (vendor.point || {}).lat;
        point.lng = (vendor.point || {}).lng;
        return point;
      });

      this.SET_MAPPOINTLIST({ mapPointList: pointList });

      this.$router.push("/map");
    },
    goDamageList() {
      this.$router.push("/repairorder");
    }
  }
};
</script>
<style lang="scss" scoped>
#vendor-list {
  margin-top: px2rem(176);
}
.base-search {
  position: fixed;
  top: px2rem(88);
  left: 0;
  right: 0;
}
.vendor-list-content {
  padding: px2rem(30) px2rem(20) 0;
}
.vendor-card {
  margin-bottom: px2rem(30);
}
</style>

<style lang="scss">
#vendor-list {
  .change-default-dailog-custom.van-popup {
    border-radius: px2rem(20) px2rem(20) 0 0;
  }
}
</style>
