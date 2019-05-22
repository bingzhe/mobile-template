<template>
    <div id="return-goods-opr">
        <base-header 
            head-title="退货"
            class="header"
        >
            <template slot="right">
                <img 
                  @click="openScanQRCode"
                  class="code-icon" 
                  src="@/assets/return_goods_code.png" 
                />
            </template>
        </base-header>

        <div class="return-cate flex-box main-space">
            <div class="label">退货类别</div>
            <div class="cate flex-box cross-center" @click="openCateSelectDialog">
                <span class="name">{{ curCateName }}</span>
                <img class="cate-icon" src="@/assets/right_gray.png" />
            </div>
        </div>

        <div class="list-title">
            <div class="flex-box">
                <div class="goods-name flex-none">商品</div>
                <div class="goods-code item-grow">商品条码</div>
                <div class="goods_opr flex-none">操作</div>
            </div>
            <div class="van-hairline--bottom"></div>
        </div>

        <div class="list-content">
            <div 
                v-for="(goods, index) in goodsList"
                :key="index"
            >
                <div class="flex-box goods-item cross-center">
                    <div class="goods-name flex-none">{{goods.goods_name}}</div>
                    <div class="goods-code item-grow">
                        <img :ref="`barcode${index}`" />
                    </div>
                    <div class="goods_opr flex-none">
                        <div 
                            @click="openOprDialog(goods)" 
                            class="v-button small"
                        >退货</div>
                    </div>
                </div>
                <div class="van-hairline--bottom"></div>
            </div>
        </div>

        <!-- 退货分类 -->
        <van-popup
            class="change-default-dailog-custom"
            v-model="showCateDialog"
            @click-overlay="cateDialogCancelClick"
            position="bottom"
        >
            <div class="cate-dialog-content">
                <div class="cate-dialog-title flex-box main-space">
                    <div class="cancel" @click="cateDialogCancelClick">取消</div>
                    <div class="label">请选择类别</div>
                    <div class="confirm" @click="cateDialogConfirmClick">确定</div>
                </div>
                <div class="van-hairline--bottom"></div>
                <van-picker 
                    ref="vanPickerCate"
                    :columns="cateList" 
                    @change="onChange"            
                />
            </div>
        </van-popup>

        <!-- 退货提示弹窗 -->
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


    </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import BaseDialog from "@/components/BaseDialog/index.vue";
import {
  returnRecordSave,
  returnRecordGet,
  vendorGoodsGategoryGet,
  vendorGoodsGet
} from "@/api/api";
import { errcode } from "@/config/cfg";
import JsBarcode from "jsbarcode";
import WxConfig from "@/config/wxConfig";
import { Public } from "@/config/public";

export default {
  components: {
    BaseHeader,
    BaseDialog
  },
  data() {
    return {
      goodsList: [],

      showCateDialog: false,
      cateList: [{ text: "全部", category_id: "0" }],

      selecIndex: 0,
      selectCateid: "0",
      selectCateName: "全部",

      curIndex: 0,
      curCateid: "0",
      curCateName: "全部",

      oprGoods: {}, //操作的goods
      showOprTip: false, //提示弹窗
      showOprText: "" //提示文字
    };
  },
  created() {
    this.getList();
    this.getCateList();
  },
  methods: {
    getList() {
      let data = {
        get_return_list: 1,
        shop_id: Public.getShopid(),
        return_status: 1 //退货状态(1.待退货中,2.退货成功)
      };

      if (this.curCateid && this.curCateid !== "0") {
        data.category_id = this.curCateid;
      }

      // console.log("待退货列表 req=>", data);
      returnRecordGet(data).then(resp => {
        // console.log("待退货列表 res=>", resp);
        if (0 === resp.ret) {
          let barElm = null;
          let barOpts = {
            width: 1,
            height: 28,
            displayValue: false
          };

          this.goodsList = resp.data.list || [];

          this.goodsList.map((item, index) => {
            //生成barcode
            this.$nextTick(function() {
              if (item.goods_bar_code) {
                barElm = this.$refs[`barcode${index}`];
                JsBarcode(barElm, item.goods_bar_code, barOpts);
              }
            });

            return item;
          });

          this.cateDialogCancelClick();
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    getCateList() {
      let data = {
        vg_category_list: 1,
        shop_id: Public.getShopid()
      };

      // console.log("分类列表 =>req", data);
      vendorGoodsGategoryGet(data).then(resp => {
        // console.log("分类列表 =>res", resp);
        if (0 === resp.ret) {
          let cateList = resp.data.list || [];

          cateList.forEach(cate => {
            let cateObj = {};
            cateObj.text = cate.category_name;
            cateObj.category_id = cate.category_id;

            this.cateList.push(cateObj);
          });
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    async openScanQRCode() {
      let codestr = await WxConfig.scanQRCode();

      this.returnGoods(codestr);
    },
    //提交商品到待退货
    returnGoods(codestr) {
      let _this = this;
      //根据查商品提交
      let data = {
        get_goods_bycode: 1,
        shop_id: Public.getShopid(),
        goods_bar_code: codestr
      };

      // console.log("根据code查找商品 =>req", data);
      vendorGoodsGet(data).then(resp => {
        // console.log("根据code查找商品 =>res", resp);
        if (0 === resp.ret) {
          let goods = resp.data.info;
          postGoods(goods);
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });

      function postGoods(goods) {
        let data = {
          photo_return_save: 1,
          shop_id: Public.getShopid(),
          vendor_goods_id: goods.vendor_goods_id
        };
        // console.log("提交商品到待退货 =>req", data);
        returnRecordSave(data).then(resp => {
          // console.log("提交商品到待退货 =>res", resp);
          if (0 === resp.ret) {
            _this.getList();
          } else {
            this.$toast({
              message: errcode.toString(resp.ret),
              duration: 2000
            });
          }
        });
      }
    },
    //提示弹窗
    openOprDialog(goods) {
      this.oprGoods = goods;
      this.showOprText = `是否确定退掉${goods.goods_name}`;
      this.showOprTip = true;
    },
    oprCancelHandle() {
      this.showOprTip = false;
      this.oprType = "";
      this.oprGoods = {};
    },
    oprConfirmHandle() {
      let data = {
        return_save: 1,
        return_id: this.oprGoods.return_id,
        use_name: Public.getUseName()
      };

      // console.log("退货操作 req=>", data);
      returnRecordSave(data).then(resp => {
        // console.log("退货操作 res=>", resp);
        if (0 === resp.ret) {
          this.getList();
          this.oprCancelHandle();
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    //分类选择弹窗
    onChange(picker, cate, index) {
      this.selectCateid = cate.category_id;
      this.selectCateName = cate.text;
      this.selecIndex = index;
    },
    openCateSelectDialog() {
      this.showCateDialog = true;

      if (this.$refs.vanPickerCate) {
        this.$refs.vanPickerCate.setIndexes([this.selecIndex]);
      }
    },
    cateDialogCancelClick() {
      this.showCateDialog = false;
      this.selectCateid = this.curCateid;
      this.selectCateName = this.curCateName;
      this.selecIndex = this.curIndex;
    },
    cateDialogConfirmClick() {
      this.curCateid = this.selectCateid;
      this.curCateName = this.selectCateName;
      this.curIndex = this.selecIndex;
      this.getList();
    }
  }
};
</script>

<style scoped lang="scss">
#return-goods-opr {
  margin-top: px2rem(236);
}
.header {
  .code-icon {
    width: px2rem(54);
    height: px2rem(45);
  }
}
.return-cate {
  position: fixed;
  top: px2rem(88);
  left: 0;
  right: 0;
  height: px2rem(68);
  line-height: px2rem(68);
  background: #f1f1f1;
  padding: 0 px2rem(20);
  .name {
    margin-right: px2rem(20);
  }
  .cate {
    .cate-icon {
      display: inline-block;
      width: px2rem(15);
      height: px2rem(28);
    }
  }
}
.list-title {
  position: fixed;
  top: px2rem(156);
  left: 0;
  right: 0;
  height: px2rem(80);
  line-height: px2rem(80);
  background: #fff;
  padding: 0 px2rem(20);
  color: #333333;
  font-size: px2rem(30);

  .goods-name {
    width: px2rem(200);
    padding-left: px2rem(10);
    box-sizing: border-box;
  }
  .goods-code {
    text-align: center;
  }
  .goods_opr {
    width: px2rem(140);
    text-align: center;
  }
}
.goods-item {
  padding: px2rem(11) 0;
  color: #333333;
  font-size: px2rem(28);
  .goods-name {
    width: px2rem(200);
    padding-left: px2rem(10);
    box-sizing: border-box;
  }
  .goods-code {
    text-align: center;
  }
  .goods_opr {
    width: px2rem(140);
    text-align: center;
  }
}
.list-content {
  padding: 0 px2rem(20);
}
.cate-dialog-content {
  padding: 0 px2rem(20);

  .cate-dialog-title {
    height: px2rem(100);
    line-height: px2rem(100);
    font-size: px2rem(30);
    .cancel {
      color: #393939;
    }
    .label {
      color: #999999;
    }
    .confirm {
      color: #5a96dc;
    }
  }
}
.van-hairline--bottom::after {
  border-color: rgba(138, 138, 138, 0.2);
}
</style>

<style lang="scss">
#return-goods-opr {
  .change-default-dailog-custom.van-popup {
    border-radius: px2rem(20) px2rem(20) 0 0;
  }
}
</style>