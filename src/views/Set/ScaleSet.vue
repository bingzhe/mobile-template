<template>
  <div id="vendor-opr-list">
    <base-header head-title="电子秤校准设置">
      <template slot="right">
        <div></div>
      </template>
    </base-header>

    <div class="search-content">
      <div class="select-status">
        <span>{{vendorStatusSelect ? VendorStatus.toString(vendorStatusSelect) : "全部"}}</span>
        <img src="@/assets/bottom_arrow.png" @click="showStatusSelect = !showStatusSelect">
      </div>
      <div class="search-input">
        <input type="text" v-model="searchValue" placeholder="设备编号，设备名称">
        <span class="search-icon flex-box cross-center" @click="onSearch">
          <img src="@/assets/search.png">
        </span>
      </div>
    </div>

    <div v-if="showStatusSelect" class="select-options">
      <div
        v-for="(status, index) in vendorStatusOptions"
        :key="status.value"
        class="option-item"
        :class="{'van-hairline--bottom': index !== vendorStatusOptions.length-1}"
        @click="handleStatusItemClick(status);"
      >{{ status.label }}</div>
    </div>
    <div class="vendor-list-wrapper">
      <scale-set
        v-for="vendor in vendorList"
        :key="vendor.vendor_id"
        :card-info="vendor"
        @oprbtn-click="handleScaleBtnClick(vendor)"
      />
    </div>
  </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import ScaleSet from "./components/ScaleCard.vue";
import { vendorGet } from "@/api/api";
import { VendorStatus, errcode } from "@/config/cfg";
import { Public } from "@/config/public";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    BaseHeader,
    ScaleSet
  },
  data() {
    return {
      searchValue: "",
      vendorList: [],

      showStatusSelect: false,
      vendorStatusSelect: 0,
      vendorStatusOptions: [
        {
          label: "全部",
          value: 0
        },
        {
          label: VendorStatus.toString(VendorStatus.NORMAL),
          value: VendorStatus.NORMAL
        },
        {
          label: VendorStatus.toString(VendorStatus.DAMAGE),
          value: VendorStatus.DAMAGE
        }
      ],
      VendorStatus
    };
  },
  computed: {
    ...mapState({
      websockInit: state => state.websockInit
    })
  },
  mounted() {
    console.log(this.$route.path);
    this.getVendorList();
  },
  methods: {
    ...mapMutations(["TOGGLE_WEBSOCK"]),
    getVendorList() {
      let data = {
        page_no: 1,
        page_size: 199,
        get_vendor_list: 1,
        shop_id: Public.getShopid()
      };

      if (this.vendorStatusSelect) {
        data.vendor_status = this.vendorStatusSelect;
      }

      if (this.searchValue) {
        data.vendor_name = this.searchValue;
      }

      console.log("设备列表 req=>", data);
      vendorGet(data).then(resp => {
        console.log("设备列表 res=>", resp);
        if (0 === resp.ret) {
          this.vendorList = resp.data.vendor_list;

          this.vendorList.map(vendor => {
            vendor.addressStr = `${vendor.province}${vendor.city}${
              vendor.area
            }${vendor.address}`;

            return vendor;
          });
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    onSearch() {
      this.getVendorList();
    },
    handleStatusItemClick(status) {
      this.vendorStatusSelect = status.value;
      this.showStatusSelect = false;
      this.getVendorList();
    },
    handleScaleBtnClick(vendor) {
      this.checkWeightThrougthWebsock(vendor);
    },
    checkWeightThrougthWebsock(vendor) {
      const url = `ws://srv${window.full_url}:13010/websocket`;
      const token = window.Store.GetGlobalData("token");
      const key = window.Store.GetGlobalData("key");
      const vendorId = vendor.vendor_id;
      const _this = this;

      //发布校准
      function publish() {
        window.WebSock.Publish(
          "general",
          {
            topic: "vendor_balance@" + vendorId,
            data: {
              vendor_id: vendorId,
              calibrate: 1
            }
          },
          resp => {
            console.log("websock 电子秤 发布通知", resp);
            if (0 === resp.ret) {
              _this.$toast({
                message: "校准通知已发送！",
                duration: 2000
              });
            } else {
              console.warn(errcode.toString(resp.ret));
            }
          }
        );
      }

      //订阅校准成功状态
      function subscribe() {
        window.WebSock.Subscribe(
          "general",
          {
            // topic: "vendor_balance_finish@" + vendorId
            topic: "vendor_goods@" + vendorId
          },
          resp => {
            console.log("websock 电子秤 校准通知", resp);
            if (0 === resp.ret) {
              /**
               * fix 其他页面弹校准通知
               */
              if (_this.$route.path === "/scaleset") {
                _this.$toast.success("校准成功");
              }

            } else {
              console.warn(errcode.toString(resp.ret));
            }
          }
        );
      }

      if (this.websockInit) {
        publish();
        subscribe();
      } else {
        window.WebSock.Init(url, token, key, () => {
          this.TOGGLE_WEBSOCK({ websockInit: true });
          publish();
          subscribe();
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
#vendor-opr-list {
  margin-top: px2rem(176);
}
.vendor-list-wrapper {
  padding: px2rem(30) px2rem(20) 0;
}
.opr-card {
  margin-bottom: px2rem(30);
}
.search-content {
  position: fixed;
  top: px2rem(88);
  height: px2rem(88);
  background: #f1f1f1;
  display: flex;
  width: 100%;
  .select-status {
    width: px2rem(155);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    img {
      width: px2rem(58);
      height: px2rem(58);
    }
  }
  .search-input {
    display: flex;
    align-items: center;
    input {
      box-sizing: border-box;
      padding: 0 px2rem(10);
      width: px2rem(550);
      // width: 100%;
      height: px2rem(58);
      background: #fff;
      border-radius: px2rem(10);
      border: px2rem(1) solid #f1f1f1;
      font-size: px2rem(28);
    }
    .search-icon {
      position: relative;
      right: px2rem(40);
      img {
        width: px2rem(30);
        height: px2rem(30);
      }
    }
  }
}

.select-options {
  position: fixed;
  box-sizing: border-box;
  padding: px2rem(18) px2rem(14);
  z-index: 999;
  top: px2rem(152);
  left: 0;
  width: px2rem(206);
  min-height: px2rem(279);
  background: url("../../assets/push_content.png");
  background-size: cover;
  .option-item {
    height: px2rem(80);
    line-height: px2rem(88);
    text-align: center;
    font-size: px2rem(28);
  }
}
</style>
