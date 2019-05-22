<template>
  <div class="dashboard-page">
    <!-- 导航 -->
    <base-header head-title="运营报表"/>
    <!-- gray-bar -->
    <div class="gray-bar"></div>
    <!-- 营业额 -->
    <div class="sales-amount-box">
      <date-picker @change-date="changeDate" @confirm-select="confirmSelect"></date-picker>
      <sales-amount
        class="date-select-content"
        :beginTime="endTime"
        :endTime="beginTime"
        :amountData="amountData"
        :pickerIndex="pickerIndex"
      />
    </div>
    <!-- gray-bar -->
    <div class="gray-bar samll-margin"></div>
    <!-- 折线图 -->
    <chart-line :lineData="lineData" @sales-or-amount="salesOrAmount"/>
    <!-- 设备销售排行前五 -->
    <vender-top :tableData="VendorTop5Data"/>
    <!-- 商品销售排行前五 -->
    <good-top :tableData="GoodTop5Data"/>
  </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import DatePicker from "./components/DatePicker.vue";
import SalesAmount from "./components/SalesAmount.vue";
import ChartLine from "./components/ChartLine.vue";
import VenderTop from "./components/VendorTop5.vue";
import GoodTop from "./components/GoodTop5.vue";
import { vendorBoard } from "@/api/api";
import { Public } from "@/config/public";
import { errcode } from "@/config/cfg";
import Util from "@/config/util";
import dayjs from "dayjs";
export default {
  components: {
    BaseHeader,
    DatePicker,
    SalesAmount,
    ChartLine,
    VenderTop,
    GoodTop
  },
  data() {
    return {
      timeType: null,
      amountData: {}, // 销售额，交易笔数，人均金额
      lineData: [], //折线数据
      VendorTop5Data: [], //设备排行榜数据
      GoodTop5Data: [], //商品排行榜数据
      beginTime: "", //开始时间
      endTime: "", //结束时间
      pickerIndex: 0,
      lineSelectIndex: 0 //销售量0  销售额1
    };
  },
  created() {
    scroll(0, 0);
    this.getTodyData();
  },
  methods: {
    //选择日期   今日，周，月
    changeDate(obj) {
      this.pickerIndex = obj.index;
      if (obj.index !== 0 && obj.index !== 3) {
        this.beginTime = obj.begin_time;
        this.endTime = obj.end_time;
        this.getData();
      }

      if (obj.index === 0) {
        this.getTodyData();
      }
    },
    //确定自定义选择的时间段  选定自定义的时间段
    confirmSelect(obj) {
      this.beginTime = obj.end_time;
      this.endTime = obj.begin_time;
      this.getData();
    },

    //切换销售量和销售额
    salesOrAmount(index) {
      this.lineSelectIndex = index;
      if (this.pickerIndex === 0) {
        this.getTodyData();
      } else {
        this.getData();
      }
    },

    //拉取周，月自定义的时间段的数据
    getData() {
      this.VendorTop5Data = [];
      this.GoodTop5Data = [];
      let timeType = parseInt(this.pickerIndex);
      let data = {
        get_date_board: 1, //参数
        shop_id: Public.getShopid(), //店铺id  //测试数据
        time_type: timeType, //时间类型<<<1.周,2.月.3.自定义//<<<<<填3不输入下面那个就时间就是找的所有数据
        begin_day: this.endTime, //开始时间<<<<<<<<<<这里应该是自定义时间的选择
        end_day: this.beginTime //结束时间时间<<<<<<<<<<这里应该是自定义时间的选择
      };
      vendorBoard(data).then(resp => {
        if (resp.ret === 0) {
          this.amountData = resp.data.data;

          let list = resp.data.list;
          let arr = [];
          list = list.map(item => {
            if (item.day) {
              let day = JSON.stringify(item.day);
              item.date = dayjs(day).format("YYYY-MM-DD");
            }
            if (this.lineSelectIndex === 0) {
              item.value = item.order_num || 0;
            } else {
              item.value = item.all_money || 0;
            }
            return item;
          });
          // console.log(list);
          // if (list.length == 0) {
          if (this.pickerIndex === 1) {
            arr = Util.handlerAgentData(
              7,
              parseInt(dayjs(this.endTime).format("X")),
              "week"
            );
          } else if (this.pickerIndex === 2) {
            arr = Util.handlerAgentData(
              30,
              parseInt(dayjs(this.endTime).format("X")),
              "month"
            );
          } else {

            let days = dayjs(this.beginTime).diff(dayjs(this.endTime), "day");
            arr = Util.handlerAgentData(
              days,
              parseInt(dayjs(this.endTime).format("X")),
              "self"
            );
          }
          list.forEach(v => {
            var key = v.date;
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].date == key) {
                arr[i].value = v.value;
                break;
              }
            }
          });
          // }
          this.lineData = arr;
          if (resp.data.sort.vendor_list.length > 0) {
            let obj = {
              rank: "排名",
              vendor_name: "设备名称",
              vendor_num: "设备编号",
              all_money: "金额"
            };
            this.VendorTop5Data.push(obj);
            resp.data.sort.vendor_list.forEach(item => {
              this.VendorTop5Data.push(item);
            });
          }

          if (resp.data.sort.goods_list.length > 0) {
            let obj = {
              rank: "排名",
              goods_name: "商品名称",
              all_num: "数量",
              price: "金额"
            };
            this.GoodTop5Data.push(obj);
            resp.data.sort.goods_list.forEach(item => {
              this.GoodTop5Data.push(item);
            });
          }
          // this.VendorTop5Data = resp.data.sort.vendor_list;
          // this.GoodTop5Data = resp.data.sort.goods_list;
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
        // console.log(resp);
      });
    },
    //获取今日的数据
    getTodyData() {
      let data = {
        get_today_data: 1, //参数
        shop_id: Public.getShopid(), //店铺id  //测试数据
        time_cut: 2 //分成几个时间段(单位小时,eg:2小时就是2)<<<<<<产品应该是固定,此处可以改变的
      };
      vendorBoard(data).then(resp => {
        if (resp.ret === 0) {
          this.amountData = resp.data.data;

          let list = resp.data.time_list;

          list = list.map(item => {
            item.date = item.time;
            if (this.lineSelectIndex === 0) {
              item.value = item.list.order_num || 0;
            } else {
              item.value = item.list.all_money || 0;
            }
            return item;
          });

          // console.log("今日数据", list);
          this.lineData = list;
          this.VendorTop5Data = resp.data.sort.vendor_list;
          this.GoodTop5Data = resp.data.sort.goods_list;
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
        // console.log(resp);s
      });
    }
  }
};
</script>

<style lang="scss" scoped>
div.gray-bar {
  margin-top: px2rem(88);
  height: px2rem(14);
  background: #eeeeee;
}

div.gray-bar.samll-margin {
  margin-top: px2rem(43);
}
//营业额
.sales-amount-box {
  position: relative;
  width: px2rem(710);
  height: px2rem(457);
  text-align: center;
  margin: px2rem(24) px2rem(20);
  padding-top: px2rem(22);
  background: rgba(255, 255, 255, 1);
  border-radius: px2rem(20);
  box-sizing: border-box;
  box-shadow: 0px 0px 7px 0px rgba(51, 51, 51, 0.2);
}
</style>

