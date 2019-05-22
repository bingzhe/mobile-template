<template>
  <div id="replenish-handle">
    <base-header :head-title="headTitle"/>

    <div class="aisle-num flex-box main-space">
      <span>货道（{{ aisleNum }}）</span>
      <span v-if="isCuihui" class="flex-cont flex-info-center" @click="toggleLocking">
        <img v-if="lockStatus" src="@/assets/unlocking.png" class="unlock-img">
        <img v-else src="@/assets/locking.png" class="lock-img">
        <span class="lock-text">{{VendorLockStatus.toString(lockStatus)}}</span>
      </span>
    </div>

    <div class="aisle-content">
      <div v-for="item in aisleList" :key="item.aisle_id" class="aisle-item">
        <aisle-card
          :aisle-info="item"
          @cap-click="aisleCapClickHandle(item, $event)"
          @on-toggle="openGoodsList('toggle', item)"
          @on-new="openGoodsList('new', item)"
          @on-saleoff="openOffTip('saleOff', item)"
          @on-reduce="openReduceDialog(item)"
        />
      </div>
    </div>

    <div class="button-content">
      <div
        v-if="showReplenishBtn"
        class="v-button large-round"
        @click="replenishOprBeforeCheck"
      >确认补货</div>
    </div>

    <!-- 提示弹窗 -->
    <van-popup
      class="change-dialog-popup-default"
      @click-overlay="oprCancelHandle"
      v-model="showOprTip"
    >
      <base-dialog
        :content="showOprText"
        @on-cancel="oprCancelHandle"
        @on-confirm="oprConfirmHandle"
      />
    </van-popup>

    <!-- 确认补货 -->
    <van-popup class="change-dialog-popup-default" v-model="showReplenishTip">
      <base-dialog
        content="确定完成补货？"
        @on-cancel="repleTipCancelHandle"
        @on-confirm="repleTipConfirmHandle"
      />
    </van-popup>

    <!-- 库存不足的时候确认补货 -->
    <van-popup
      class="change-dialog-popup-default"
      v-model="showReplenishStockTip"
      @click-overlay="repleStockTipCancelHandle"
    >
      <replen-stock-dialog
        :content="replenishStockTipText"
        @on-cancel="repleStockTipCancelHandle"
        @on-confirm="repleStockTipConfirmHandle"
      />
    </van-popup>

    <!-- 减货弹窗 -->
    <van-popup
      class="change-default-dailog-custom"
      v-model="showReduceDialog"
      @click-overlay="reduceDialogCancelHandle"
      position="bottom"
    >
      <reduce-dialog
        :aisle-info="oprReduceAisle"
        @reduce-opr="reduceGoodsOprHandle"
        @on-cancel="reduceDialogCancelHandle"
      />
    </van-popup>

    <!-- 商品列表弹窗 -->
    <van-popup
      class="change-default-dailog-custom"
      v-model="showGoodsListDialog"
      position="bottom"
      @click-overlay="goodsCancelClickHandle"
    >
      <goodslist-dialog @on-goods-click="goodsClickHandle" @on-cancel="goodsCancelClickHandle"/>
    </van-popup>
  </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import BaseDialog from "@/components/BaseDialog/index.vue";
import AisleCard from "./components/AisleCard.vue";
import ReduceDialog from "./components/ReduceDialog.vue";
import GoodslistDialog from "./components/GoodslistDialog.vue";
import ReplenStockDialog from "./components/ReplenStockDialog.vue";
import { aisleGet, aisleSave, loginSave, vendorGet } from "@/api/api";
import { errcode, AisleCapStatus, VendorLockStatus } from "@/config/cfg";
import { Public } from "@/config/public";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    BaseHeader,
    BaseDialog,
    AisleCard,
    ReduceDialog,
    GoodslistDialog,
    ReplenStockDialog
  },

  data() {
    return {
      headTitle: "",
      vendor_id: "",

      aisleNum: 0,
      aisleList: [],

      showReduceDialog: false, //减货弹窗

      showGoodsListDialog: false, //商品列表弹窗

      replenishMap: {}, //需要补货的商品
      replenishList: [],

      showReplenishBtn: false,

      showReplenishTip: false, //补货提示

      showReplenishStockTip: false, //库存不足时候补货提示
      replenishStockTipText: "",

      oprReduceAisle: {}, //减货操作货道

      addType: "", //货道商品新配置，还是更换, new,toggle

      oprType: "", //提示弹窗类型
      oprAisle: {}, //操作的货道
      oprGoods: {}, //配置操作goods
      showOprTip: false, //提示弹窗
      showOprText: "", //提示文字

      lockStatus: 0, //0关锁 ，1开锁
      VendorLockStatus
    };
  },
  computed: {
    ...mapState({
      websockInit: state => state.websockInit,
      isCuihui: state => state.isCuihui
    })
  },
  watch: {
    replenishMap: {
      handler: function (val, oldVal) {
        let arr = Object.keys(val);
        if (arr.length > 0) {
          this.showReplenishBtn = true;
        } else {
          this.showReplenishBtn = false;
        }
      }
    }
  },
  created() {
    let vendorNum = this.$route.query.vendornum;
    // let vendorName = this.$route.query.vendorname;
    this.headTitle = `${vendorNum}`;
    this.vendor_id = this.$route.query.vendorid || "";
    if (this.vendor_id) {
      this.getVendorInfo();
      this.getAisleList();
      this.getAisleInfoThroughWebsock();
    }
  },
  // beforeDestroy() {
  //   window.WebSock.Close();
  // },
  methods: {
    ...mapMutations(["TOGGLE_WEBSOCK"]),
    toggleLocking() {
      if (this.lockStatus) {
        return;
      }
      let data = {
        open_vendor_lock: 1,
        vendor_id: this.vendor_id
      };
      loginSave(data).then(resp => {
        if (resp.ret === 0) {
          // this.getVendorInfo();
          // this.$toast({
          //   message: "已开锁",
          //   duration: 2000
          // });
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    getVendorInfo() {
      let data = {
        get_vendor_info: 1,
        vendor_id: this.vendor_id
      };

      // console.log("设备详情 req=>", data);
      vendorGet(data).then(resp => {
        // console.log("设备详情 res=>", resp);
        if (0 === resp.ret) {
          let info = resp.data.info;
          this.lockStatus = info.lock_status;
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    getAisleList() {
      let data = {
        get_aisle_list: 1,
        vendor_id: this.vendor_id
      };

      // console.log("货道列表 req=>", data);
      aisleGet(data).then(resp => {
        // console.log("货道列表 res=>", resp);
        if (0 === resp.ret) {
          this.aisleList = resp.data.aisle_list || [];
          this.aisleNum = this.aisleList.length;

          this.aisleList.map(aisle => {
            aisle.goods_img_str = (aisle.goods_img || [])[0] || "";

            /**
             * 根据aisle_capacity生成aisleCapList，为每一个货道容量添加状态
             * 1.未补货 2.无需补货 3.补货选中 4.库存不足
             */
            let aisleCapList = [];
            aisle.goods_num = aisle.goods_num || 0; //货道库存数
            aisle.aisle_capacity = aisle.aisle_capacity || 0; //货到容量
            aisle.goods_stock = aisle.goods_stock || 0; //商品库存

            for (let index = 0; index < aisle.aisle_capacity; index++) {
              const val = index + 1;
              const aisleCap = {
                value: val,
                status: AisleCapStatus.EMPTY
              };
              if (val <= aisle.goods_num) {
                aisleCap.status = AisleCapStatus.HASGOODS;
              }
              aisleCapList.push(aisleCap);
            }
            // aisle.aisleCapList = aisleCapList;

            this.$set(aisle, "aisleCapList", aisleCapList);

            return aisle;
          });

          this.replenishMap = {};
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },

    //提示弹窗
    openOprDialog(type, str) {
      this.oprType = type;
      this.showOprText = str;
      this.showOprTip = true;
    },
    oprCancelHandle() {
      this.showOprTip = false;
      this.oprType = "";
      this.oprGoods = {};
    },
    oprConfirmHandle() {
      switch (this.oprType) {
        case "saleOn": //上架提示
          this.addGoodsToAisle();
          break;
        case "saleToggle": //更换下架提示
          this.addGoodsToAisle();
          break;
        case "saleOff": //下架提示
          this.offTipConfirmClickHandle();
          break;

        default:
          break;
      }
    },

    //商品列表弹窗
    openGoodsList(type, aisle) {
      // 是萃会的话需要是开锁状态才能更换，上新
      if (this.isCuihui && !this.lockStatus) {
        this.$toast({
          message: "请确认锁已经打开",
          duration: 2000
        });
        return;
      }

      this.addType = type;
      this.oprAisle = aisle;
      this.showGoodsListDialog = true;
    },
    goodsCancelClickHandle() {
      this.addType = "";
      this.oprAisle = {};

      this.showGoodsListDialog = false;
    },
    goodsClickHandle(goods) {
      this.oprGoods = goods;
      let tipStr = "";

      switch (this.addType) {
        case "new":
          tipStr = `确认上架${goods.vendor_goods_name}？`;
          this.openOprDialog("saleOn", tipStr);
          break;
        case "toggle":
          tipStr = `确认下架${this.oprAisle.goods_name}？`;
          this.openOprDialog("saleToggle", tipStr);
          break;
        default:
          break;
      }
    },
    //配置商品
    addGoodsToAisle() {
      let data = {
        save_aisle: 1,
        aisle_id: this.oprAisle.aisle_id,
        vendor_goods_id: this.oprGoods.vendor_goods_id
      };

      // console.log("配置商品/更换 req=>", data);
      aisleSave(data).then(resp => {
        // console.log("配置商品/更换 res=>", resp);
        if (0 === resp.ret) {
          this.getAisleList();
          this.oprCancelHandle();
          this.goodsCancelClickHandle();
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },

    //库存不足时候补货提示
    openRepleStockTip(str) {
      this.replenishStockTipText = str;
      this.showReplenishStockTip = true;
    },
    repleStockTipCancelHandle() {
      this.showReplenishStockTip = false;
      this.replenishStockTipText = "";
    },
    repleStockTipConfirmHandle() {
      this.replenishOpr();
    },

    //补货提示
    openRepleTip() {
      this.showReplenishTip = true;
    },
    repleTipCancelHandle() {
      this.showReplenishTip = false;
    },
    repleTipConfirmHandle() {
      this.replenishOpr();
    },

    //下架提示
    openOffTip(type, aisle) {
      // 是萃会的话需要是开锁状态才能更换，上新
      if (this.isCuihui && !this.lockStatus) {
        this.$toast({
          message: "请确认锁已经打开",
          duration: 2000
        });
        return;
      }
      this.oprAisle = aisle;
      let tipStr = `确认下架${this.oprAisle.goods_name}？`;
      this.openOprDialog(type, tipStr);
    },

    // 下架操作
    offTipConfirmClickHandle() {
      let data = {
        save_aisle: 1,
        aisle_id: this.oprAisle.aisle_id,
        is_sale: 1
      };

      // console.log("货道商品下架 req=>", data);
      aisleSave(data).then(resp => {
        // console.log("货道商品下架 res=>", resp);
        if (0 === resp.ret) {
          this.getAisleList();
          this.oprCancelHandle();
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },

    //减货弹窗
    openReduceDialog(aisle) {
      // 是萃会的话不能点击
      if (this.isCuihui) {
        return;
      }
      this.oprReduceAisle = aisle;
      this.showReduceDialog = true;
    },
    reduceDialogCancelHandle() {
      this.oprReduceAisle = {};
      this.showReduceDialog = false;
    },
    // 减货处理
    reduceGoodsOprHandle(num) {
      let data = {
        save_aisle: 1,
        aisle_id: this.oprReduceAisle.aisle_id,
        goods_num: num
      };

      // console.log("减货处理 req=>", data);
      aisleSave(data).then(resp => {
        // console.log("减货处理 res=>", resp);
        if (0 === resp.ret) {
          this.reduceDialogCancelHandle();
          this.getAisleList();
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },

    /**
     * 容量点击处理
     * 1. 有商品的货道容量不会更改
     * 2. 空的货道容量可以添加
     * 3. 库存不足的时候会显示不足
     */
    aisleCapClickHandle(aisle, capInfo) {
      // 是萃会的话不能点击
      if (this.isCuihui) {
        return;
      }

      const index = capInfo.value;
      const status = capInfo.status;

      /**
       * 不是补货操作的容量不能点击
       */
      if (index <= aisle.goods_num) {
        return;
      }

      //后面是否还有选中的容量，没有选中的时候改为清掉当前选中
      let hasSelect = false;
      aisle.aisleCapList.forEach((cap, i) => {
        if (i + 1 > index) {
          if (
            cap.status === AisleCapStatus.ADDSELECT ||
            cap.status === AisleCapStatus.STOCKSHORT
          ) {
            hasSelect = true;
          }
        }
      });

      aisle.aisleCapList.forEach((cap, i) => {
        if (i + 1 > aisle.goods_num && i + 1 <= index) {
          if (i + 1 - aisle.goods_num > aisle.goods_stock) {
            //库存不足
            cap.status = AisleCapStatus.STOCKSHORT;
          } else {
            cap.status = AisleCapStatus.ADDSELECT;
          }
        } else if (i + 1 > index) {
          cap.status = AisleCapStatus.EMPTY;
        }
      });

      //后面是否还有选中的容量，没有选中的时候改为清掉当前选中，更新容量状态
      if (
        !hasSelect &&
        (status === AisleCapStatus.ADDSELECT ||
          status === AisleCapStatus.STOCKSHORT)
      ) {
        capInfo.status = AisleCapStatus.EMPTY;
        const preIndex = index - 1;


        aisle.aisleCapList.forEach((cap, i) => {
          if (i + 1 > aisle.goods_num && i + 1 <= preIndex) {
            if (i + 1 - aisle.goods_num > aisle.goods_stock) {
              //库存不足
              cap.status = AisleCapStatus.STOCKSHORT;
            } else {
              cap.status = AisleCapStatus.ADDSELECT;
            }
          } else if (i + 1 > preIndex) {
            cap.status = AisleCapStatus.EMPTY;
          }
        });
      }

      this.addGoodsToReplenishMap(aisle);
    },

    //添加商品到补货列表
    /**
     * @param { Object } aisle 货道信息
     * @param { Number } value 点击的val
     */
    addGoodsToReplenishMap(aisle) {
      const aisleId = aisle.aisle_id;
      let addNum = 0;
      let isStockShort = false; //是否有库存不足

      aisle.aisleCapList.forEach(cap => {
        if (cap.status === AisleCapStatus.STOCKSHORT) {
          isStockShort = true;
        }

        if (cap.status !== AisleCapStatus.EMPTY) {
          addNum = cap.value;
        }
      });

      let replenishGoods = {
        aisle_id: aisleId,
        aisle_name: aisle.aisle_name,
        vendor_goods_id: aisle.vendor_goods_id,
        isStockShort: isStockShort
      };

      if (isStockShort) {
        replenishGoods.goods_num = aisle.goods_stock + aisle.goods_num;
      } else {
        replenishGoods.goods_num = addNum;
      }

      if (aisle.goods_num === addNum) {
        this.$delete(this.replenishMap, aisleId);
      } else {
        this.$set(this.replenishMap, aisleId, replenishGoods);
      }
    },
    deleteReplenishMapGoods(aisle_id) {
      this.$delete(this.replenishMap, aisle_id);
    },
    replenishOprBeforeCheck() {
      this.replenishList = [];
      let isStockShort = false;
      let stockAisleArr = [];
      let stockTipText = "";

      for (const key in this.replenishMap) {
        if (this.replenishMap.hasOwnProperty(key)) {
          const element = this.replenishMap[key];

          if (element.isStockShort) {
            isStockShort = true;
            stockAisleArr.push(element.aisle_name);
          }

          this.replenishList.push(element);
        }
      }

      if (isStockShort) {
        stockTipText =
          stockAisleArr.join("\\") + "货道商品库存不足，是否继续补货？";
        this.openRepleStockTip(stockTipText);
      } else {
        this.openRepleTip();
      }
    },

    replenishOpr() {
      let data = {
        aisle_record: 1,
        vendor_id: this.vendor_id,
        list: this.replenishList,
        use_name: Public.getUseName()
      };

      // console.log("补货操作 req=>", data);
      aisleSave(data).then(resp => {
        // console.log("补货操作 res=>", resp);
        if (0 === resp.ret) {
          this.getAisleList();
          this.repleStockTipCancelHandle();
          this.repleTipCancelHandle();
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },

    /**
     * 实时获取上货信息
     */
    getAisleInfoThroughWebsock() {
      const url = `ws://srv${window.full_url}:13010/websocket`;
      const token = window.Store.GetGlobalData("token");
      const key = window.Store.GetGlobalData("key");
      const _this = this;
      // console.log(window.WebSock);
      //上货订阅
      function subscribe() {
        window.WebSock.Subscribe(
          "general",
          {
            topic: "vendor_goods@" + _this.vendor_id
          },
          resp => {
            console.log("websock 补货 实时通知", resp);
            if (0 === resp.ret) {
              let data = resp.data;
              if (data.vendor_id != _this.vendor_id) {
                return;
              }
              let goodsList = data.goods_list || [];
              goodsList.forEach(goods => {
                let updateAisle = _this.aisleList.filter(
                  aisle => aisle.aisle_id === goods.aisle_id
                );
                //更新数据
                if (updateAisle && updateAisle.length === 1) {
                  updateAisle[0].goods_num = goods.goods_num;
                  _this.$set(updateAisle[0], "goods_stock", goods.goods_stock);
                }
              });

              _this.updateAisleInfo();
              // this.getAisleList();
            } else {
              console.warn(errcode.toString(resp.ret));
            }
          }
        );
      }
      //锁状态订阅
      function lockStatusSubscribe() {
        window.WebSock.Subscribe(
          "general",
          {
            topic: "vendor_door_status@" + _this.vendor_id
          },
          resp => {
            console.log("websock loca_status 实时通知", resp);
            if (0 === resp.ret) {
              _this.lockStatus = Number(resp.data.is_open);
            } else {
              console.warn(errcode.toString(resp.ret));
            }
          }
        );
      }
      if (this.websockInit) {
        subscribe();
        lockStatusSubscribe();
      } else {
        window.WebSock.Init(url, token, key, () => {
          this.TOGGLE_WEBSOCK({ websockInit: true });
          subscribe();
          lockStatusSubscribe();
        });
      }
    },

    /**
     * 实时更新货道信息界面
     * 更新的时候重置了补货数据的。
     */
    updateAisleInfo() {
      this.aisleList.map(aisle => {
        /**
         * 根据aisle_capacity生成aisleCapList，为每一个货道容量添加状态
         * 1.未补货 2.无需补货 3.补货选中 4.库存不足
         */
        let aisleCapList = [];
        for (let index = 0; index < aisle.aisle_capacity; index++) {
          const val = index + 1;
          const aisleCap = {
            value: val,
            status: AisleCapStatus.EMPTY
          };
          if (val <= aisle.goods_num) {
            aisleCap.status = AisleCapStatus.HASGOODS;
          }
          aisleCapList.push(aisleCap);
        }

        this.$set(aisle, "aisleCapList", aisleCapList);
      });
      this.replenishMap = {};
    }
  }
};
</script>

<style lang="scss" scoped>
#replenish-handle {
  margin-top: px2rem(148);
}
.flex-cont {
  /*定义为flexbox的"父元素"*/
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
.flex-info-center {
  -webkit-box-align: center;
  -webkit-align-items: center; //项目在交叉轴上居中对齐
  align-items: center;
}
.aisle-num {
  position: fixed;
  top: px2rem(88);
  left: 0;
  right: 0;
  height: px2rem(68);
  line-height: px2rem(68);
  padding: 0 px2rem(20);
  color: #323232;
  font-size: px2rem(32);
  background: #f1f1f1;
  .lock-img {
    width: px2rem(40);
    height: px2rem(46);
    margin-right: px2rem(12);
  }
  .unlock-img {
    width: px2rem(52);
    height: px2rem(46);
    margin-right: px2rem(12);
  }
  .lock-text {
    font-size: px2rem(28);
    color: #999;
  }
}
.aisle-content {
  padding: px2rem(50) px2rem(20) 0;
  .aisle-item {
    margin-bottom: px2rem(32);
  }
}
.button-content {
  margin: px2rem(100) 0 px2rem(60);
  text-align: center;
  border-bottom: 1px solid #fff;
}
</style>

<style lang="scss">
#replenish-handle {
  .change-default-dailog-custom.van-popup {
    border-radius: px2rem(20) px2rem(20) 0 0;
  }
}
</style>
