<template>
  <div id="operation-set">
    <base-header head-title="运营配置">
      <template slot="right">
        <div></div>
      </template>
    </base-header>

    <div class="operation-list-wrapper">
      <div class="operation-item" @click="goTemperatureSet">
        <div>温度校准值设置</div>
        <div class="icon-arrow">
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="van-hairline--bottom"></div>
      <div class="operation-item" @click="openSelectDayDialog('expiration')">
        <div>商品批次保质期时间设定</div>
        <div class="icon-arrow">
          <span class="icon-label">{{goods_shelf_life}}天</span>
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="van-hairline--bottom"></div>
      <div class="operation-item" @click="openSelectDayDialog('warning')">
        <div>保质期预警时间设定</div>
        <div class="icon-arrow">
          <span class="icon-label">{{shelf_life_warning}}天</span>
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="van-hairline--bottom"></div>
      <div class="operation-item" @click="goScaleSet">
        <div>电子称校准</div>
        <div class="icon-arrow">
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="van-hairline--bottom"></div>
    </div>

    <!-- 天数选择 -->
    <van-popup
      class="change-default-dailog-custom"
      v-model="showSelectDayDialog"
      @click-overlay="handleSelectDayDialogCancel"
      position="bottom"
    >
      <dialog-day-select
        @on-cancel="handleSelectDayDialogCancel"
        @on-confirm="handleSelectDayDialogConfirm"
        :default-index="defaultIndex"
      />
    </van-popup>
  </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import DialogDaySelect from "./components/DialogDaySelect";
import { vendorSave, loginSave } from "@/api/api";
import { errcode } from "@/config/cfg";
import { Public } from "@/config/public";

export default {
  components: {
    BaseHeader,
    DialogDaySelect
  },
  data() {
    return {
      showSelectDayDialog: false,

      saveType: "",
      defaultIndex: 0,
      goods_shelf_life: 0,    //商品批次保质期时间
      shelf_life_warning: 0   //保质期预警时间
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      let data = {
        get_shop: 1,
        shop_id: Public.getShopid()
      };

      console.log("雇员信息 req=>", data);
      loginSave(data).then(resp => {
        console.log("雇员信息 res=>", resp);
        if (0 === resp.ret) {
          let shopInfo = resp.data.shop_info || {};

          this.goods_shelf_life = shopInfo.goods_shelf_life;
          this.shelf_life_warning = shopInfo.shelf_life_warning;
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    openSelectDayDialog(type) {
      this.saveType = type;

      switch (this.saveType) {
        case "expiration":
          this.defaultIndex = this.goods_shelf_life;
          break;
        case "warning":
          this.defaultIndex = this.shelf_life_warning;
          break;
        default:
          break;
      }
      this.showSelectDayDialog = true;
    },
    handleSelectDayDialogCancel() {
      this.saveType = "";
      this.defaultIndex = 0;
      this.showSelectDayDialog = false;
    },
    handleSelectDayDialogConfirm(index) {
      let data = {
        shelf_life_save: 1, //参数
        shop_id: Public.getShopid()
      };

      switch (this.saveType) {
        case "expiration":
          data.goods_shelf_life = index + 1;
          break;
        case "warning":
          data.shelf_life_warning = index + 1;
          break;
        default:
          break;
      }

      console.log("保存批次和预警 req=>", data);
      vendorSave(data).then(resp => {
        console.log("保存批次和预警 res=>", resp);
        if (0 === resp.ret) {
          this.$toast.success("设置成功");
          this.getInfo();
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
      this.showSelectDayDialog = false;
    },
    goTemperatureSet() {
      this.$router.push("/temperaset");
    },
    goScaleSet() {
      this.$router.push("/scaleset");
    }
  }
};
</script>

<style lang="scss" scoped>
#operation-set {
  margin-top: px2rem(88);
}
.operation-item {
  height: px2rem(88);
  padding: 0 px2rem(24);
  font-size: px2rem(30);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.van-hairline--bottom::after {
  border-color: #e4e4e4;
}
.icon-arrow {
  font-size: px2rem(32);
  color: #c7c7c7;
  display: flex;
  align-items: center;
  .icon-label {
    margin-right: px2rem(10);
  }
}
</style>


