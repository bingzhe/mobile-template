<template>
    <div id="tempera-set-page">
        <base-header 
            head-title="温度校准值设置"
        >
            <template slot="right">   
                <div></div>
            </template> 
        </base-header>

        <div class="search-content">
            <div class="select-status">
              <span>{{vendorStatusSelect ? VendorStatus.toString(vendorStatusSelect) : "全部"}}</span>
              <img src="@/assets/bottom_arrow.png" @click="showStatusSelect = !showStatusSelect"/>
            </div>

            <div class="search-input">
                <input 
                    type="text" 
                    v-model="searchValue"
                    placeholder="设备编号，设备名称"
                />
                <span class="search-icon flex-box cross-center" @click="onSearch">
                    <img src="@/assets/search.png" />
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
          >
            {{ status.label }}
          </div>
        </div>

        <div class="vendor-list-wrapper">
            <tempera-card 
                v-for="vendor in vendorList"
                :key="vendor.vendor_id"
                :card-info="vendor"
                @click.native="handleVendorCardClick(vendor)"
            />
        </div>

        <div class="tempera-set-bottom">
            <div class="tempera-title">
                <div class="tem-lable">温度校准值设置</div>
                <div class="tem-input">
                    <input 
                        type="text"
                        v-model="temperatrue"
                        placeholder="请输入温度值"
                    />
                    <span>°C</span>
                </div>
            </div>
            <div class="van-hairline--bottom"></div>            
            <div class="tempera-history">
                <div 
                    class="temp-item"
                    v-for="(item,index) in temperatrueHistory"
                    :key="index"
                    @click="handleTempleItemClick(item)"
                >
                    {{item}}°C
                </div>
            </div>
            <div class="tempare-bottom">
                <div class="tempare-tip">
                    <img src="@/assets/tis.png" />
                    <span>个人资料将由并仅限赛领软件使用!</span>
                </div>
                <div class="save-btn" @click="handleSaveClick">保存</div>
            </div>
        </div>
        <gray-bg />
    </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import TemperaCard from "./components/TemperaCard";
import GrayBg from "@/components/GrayBg/index";
import { vendorGet, vendorSave } from "@/api/api";
import { Public } from "@/config/public";
import { VendorStatus, errcode } from "@/config/cfg";

export default {
  components: {
    BaseHeader,
    TemperaCard,
    GrayBg
  },
  data() {
    return {
      searchValue: "",
      temperatrue: "",
      temperatrueHistory: [],
      vendorList: [],
      selectVendorList: [],

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
  mounted() {
    this.init();
    this.getVendorList();
  },
  methods: {
    init() {
      const temHistory = window.Store.GetGlobalData("VEN_temperaturehistory");

      if (temHistory) {
        this.temperatrueHistory = JSON.parse(temHistory);
      } else {
        this.temperatrueHistory = [38, 28, 8];
      }
    },
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

            this.$set(vendor, "active", false);
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
    handleVendorCardClick(vendor) {
      const vendorId = vendor.vendor_id;
      const index = this.selectVendorList.indexOf(vendorId);

      if (index === -1) {
        this.selectVendorList.push(vendorId);
        vendor.active = true;
      } else {
        this.selectVendorList.splice(index, 1);
        vendor.active = false;
      }
    },
    onSearch() {
      this.getVendorList();
    },
    handleTempleItemClick(val) {
      this.temperatrue = val;
    },
    handleSaveClick() {
      if (!this.temperatrue) {
        this.$toast({
          message: "请输入校准温度值",
          duration: 2000
        });
        return;
      }

      if (this.selectVendorList.length === 0) {
        this.$toast({
          message: "请选择需要校准的设备",
          duration: 2000
        });
        return;
      }

      let data = {
        temperature_save: 1, //参数
        vendor_id_list: this.selectVendorList, //设备id
        temperature: this.temperatrue //温度校准值
      };

      console.log("温度校准值保存 req=>", data);
      vendorSave(data).then(resp => {
        console.log("温度校准值保存 res=>", resp);

        if (0 === resp.ret) {
          this.$toast.success("设置成功!");

          //loca添加历史记录，不超过5
          if (
            this.temperatrueHistory.indexOf(Number(this.temperatrue)) === -1
          ) {
            this.temperatrueHistory.push(Number(this.temperatrue));

            while (this.temperatrueHistory.length > 5) {
              this.temperatrueHistory.shift();
            }

            window.Store.SetGlobalData(
              "VEN_temperaturehistory",
              JSON.stringify(this.temperatrueHistory)
            );
          }
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    handleStatusItemClick(status) {
      this.vendorStatusSelect = status.value;
      this.showStatusSelect = false;
      this.getVendorList();
    }
  }
};
</script>

<style lang="scss" scoped>
#tempera-set-page {
  margin-top: px2rem(176);
}
.vendor-list-wrapper {
  padding: px2rem(30) px2rem(20) 0;
}
.tempera-card {
  margin-bottom: px2rem(24);
}
.search-content {
  position: fixed;
  top: px2rem(88);
  height: px2rem(88);
  background: #fff;
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
      background: #f1f1f1;
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
.vendor-list-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: px2rem(176);
  bottom: px2rem(386);
  overflow: scroll;
}
.tempera-set-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  .tempera-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 px2rem(40);
    height: px2rem(80);
    background: #fff;
    font-size: px2rem(28);

    .tem-input {
      input {
        text-align: right;
        width: px2rem(300);
        box-sizing: border-box;
        padding: 0 px2rem(10);
        height: px2rem(58);
        background: #fff;
        border-radius: px2rem(10);
        border: none;
        font-size: px2rem(28);
      }
    }
  }
  .tempera-history {
    height: px2rem(158);
    background: #fff;
    padding: px2rem(30) px2rem(40) 0;
    display: flex;
    flex-wrap: wrap;
    .temp-item {
      margin: 0 px2rem(20) px2rem(10) 0;
      box-sizing: border-box;
      padding: 0 px2rem(10);
      min-width: px2rem(125);
      height: px2rem(58);
      border-radius: px2rem(29);
      background: #ececec;
      font-size: px2rem(28);
      text-align: center;
      line-height: px2rem(58);
    }
  }
  .tempare-tip {
    height: px2rem(50);
    background: rgba(90, 150, 220, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999999;
    font-size: px2rem(22);

    img {
      margin-right: px2rem(14);
      height: px2rem(30);
      width: px2rem(30);
    }
  }
  .save-btn {
    height: px2rem(98);
    line-height: px2rem(98);
    text-align: center;
    color: #fff;
    font-size: px2rem(36);
    background: #5a96dc;
  }
}

.select-options {
  position: relative;
  box-sizing: border-box;
  padding: px2rem(18) px2rem(14);
  z-index: 999;
  top: px2rem(-24);
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