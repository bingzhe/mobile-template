<template>
  <div class="repair-order-list">
    <!-- 头部 -->
    <base-header head-title="故障处理"/>
    <!-- 列表 -->
    <van-tabs v-model="active" @change="changeTabs">
      <van-tab :title="item.title" v-for="(item,index) in tabList" :key="index">
        <van-list
          v-model="item.loading"
          :finished="item.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="(contentItem,index) in item.content" :key="index">
            <list-card
              :activeIndex="active"
              :cardInfo="contentItem"
              @reorder="goToOrder(contentItem.fault_id)"
              @goToDeal="goToOrder(contentItem.fault_id)"
            />
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
    <!-- 距离筛选 -->
    <van-popup v-model="isShowScreenBox" :position="bottom">
      <van-picker
        v-if="columns.length>0"
        show-toolbar
        :columns="columns"
        @confirm="confirmPicker"
        @cancel="isShowScreenBox = false"
      />

      <div v-else class="no-data">
        <p class="flex-box main-space blue-btn">
          <span @click="isShowScreenBox = false">取消</span>
          <span @click="isShowScreenBox = false">确定</span>
        </p>
        <div class="no-data-text">暂无维修人员数据，无法派单</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TenMap from "@/config/map.js";
import WxConfig from "@/config/wxConfig";
import { faultGet, faultSave, vendorGet } from "@/api/api";
import { VendorStatus, errcode } from "@/config/cfg";
import { Public } from "@/config/public";
import BaseHeader from "@/components/BaseHeader/index.vue";
import ListCard from "./components/listCard.vue";
import { mapState } from "vuex";
export default {
  components: {
    BaseHeader,
    ListCard
  },
  data() {
    return {
      VendorStatus,
      bottom: "bottom",
      active: 0, //tab选中
      page_no: 1,
      page_size: 99,
      locationPoint: { lat: 22.55329, lng: 113.88308 },
      tabList: [
        {
          title: "待派单",
          loading: false,
          finished: true,
          content: [],
          vendorPointList: [],
          promiseList: [],
          vendorDistanceList: []
        },
        {
          title: "已派单",
          loading: false,
          finished: true,
          content: [],
          vendorPointList: [],
          promiseList: [],
          vendorDistanceList: []
        }
      ],
      isShowScreenBox: false,
      handelID: "", //处理对象
      columns: [], //派单人员列表
      vendor_person: {} //选中派单人员信息
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
    this.getvendorPerson();
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let data = {
        get_fault_list: 1, //参数
        shop_id: Public.getShopid(), //店铺id  //测试数据
        is_send: this.active, // 是否派单(1.派单,0.待派单)
        page_no: this.page_no,
        page_size: this.page_size
      };
      if (1 == this.active) {
        data["deal_status"] = 2;
      }
      faultGet(data).then(resp => {
        if (resp.ret === 0) {
          let list = resp.data.fault_list;
          let total = resp.data.total;
          list = list.map(item => {
            item.vendor_status_str = this.VendorStatus.toString(
              item.vendor_status
            );
            item.fault_time_str = dayjs(item.fault_time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );

            item.time_str = dayjs(item.time * 1000).format("YYYY.MM.DD HH:mm");
            let addressStr = `${item.province}${item.city}${item.area}${
              item.address
            }`;
            this.tabList[this.active].promiseList.push(
              TenMap.getPoint(addressStr)
            );
            // 地址转为经纬度
            TenMap.getPoint(addressStr).then(point => {
              this.tabList[this.active].vendorPointList.push(point);
              item.point = point;
            });
            return item;
          });
          if (this.wxSdkConfig) {
            this.calcuDistance();
          }
          this.tabList[this.active].content = list;
          // this.tabList[this.active].content = [
          //   ...this.tabList[this.active].content,
          //   ...list
          // ];
          this.loading = false;
          this.refreshing = false;

          if (this.tabList[this.active].content.length === total) {
            this.finished = true;
          }
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    },
    //定位
    getLocation() {
      return new Promise(resolve => {
        WxConfig.getLocation().then(point => {
          this.locationPoint = point;
          resolve(point);
        });
      });
    },
    //计算距离时间
    getDistance() {
      let fromStr = `${this.locationPoint.lat},${this.locationPoint.lng}`;

      let toArr = this.tabList[this.active].vendorPointList.map(item => {
        return `${item.lat},${item.lng}`;
      });
      let toStr = toArr.join(";");

      // console.log("fromStr", fromStr);
      // console.log("toStr", toStr);

      TenMap.getDistance(fromStr, toStr).then(resp => {
        // console.log("距离计算结果", resp);
        this.tabList[this.active].vendorDistanceList = resp.elements;

        this.tabList[this.active].content.map((vendor, index) => {
          vendor.distance = this.tabList[this.active].vendorDistanceList[
            index
          ].distance;
          vendor.duration = this.tabList[this.active].vendorDistanceList[
            index
          ].duration;

          this.$set(vendor, "distanceStr", vendor.distance / 1000);
          this.$set(vendor, "timeStr", this.getDateDiff(vendor.duration));
        });
      });
    },
    /**
     * 秒转小时分钟
     */
    getDateDiff(val) {
      let minute = 60;
      let hour = minute * 60;

      let hourC = val / hour;
      let minC = val / minute;

      let result;
      if (hourC >= 1) {
        let min = parseInt(minC - parseInt(hourC) * 60);
        result = "" + parseInt(hourC) + "小时";
        if (min >= 1) {
          result = result + min + "分钟";
        }
      } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟";
      } else {
        result = "1分钟";
      }
      return result;
    },
    calcuDistance() {
      let pormiseLocation = this.getLocation();

      Promise.all([
        ...this.tabList[this.active].promiseList,
        pormiseLocation
      ]).then(resp => {
        // console.log("PromiseAll", resp);
        this.getDistance();
      });
    },
    onLoad() {
      // this.page_no++;
      // this.getList();
    },

    changeTabs() {
      this.tabList[this.active].content = [];
      this.getList();
    },

    //获取派送人员列表
    getvendorPerson() {
      let data = {
        get_vendor_person: 1, //参数
        shop_id: Public.getShopid() //店铺id   //测试数据
      };
      vendorGet(data).then(resp => {
        if (resp.ret === 0) {
          let personList = resp.data.person_list;
          let personArr = [];
          for (const key in personList) {
            personArr.push(personList[key]);
            if (personList[key].vendor_person) {
              personList[key]["text"] = personList[key].vendor_person;
            }
          }
          // personList = personList.map(item => {
          //   item.text = item.vendor_person;
          //   return item;
          // });

          this.columns = personArr;
        }

        // console.log(resp);
      });
    },
    confirmPicker(value) {
      // this.goToOrder();
      // console.log(value);
      this.vendor_person = value;
      this.sendOrder();
    },

    sendOrder() {
      let data = {
        is_send_fault: 1, //参数
        fault_id: this.handelID, //故障id
        deal_name: this.vendor_person.vendor_person, //处理人<<<<<派单人列表里面获取
        name_phone: this.vendor_person.person_phone //处理人电话<<<<<派单人列表里面获取
      };
      faultSave(data).then(resp => {
        if (resp.ret === 0) {
          this.page_no = 1;
          this.tabList[this.active].content = [];
          this.getList();
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
      this.isShowScreenBox = false;
    },
    goToOrder(id) {
      this.isShowScreenBox = true;
      this.handelID = id;
      // this.handelInfo =
    }
  }
};
</script>

<style lang="scss">
.repair-order-list {
  .van-tabs {
    margin-top: px2rem(88);
  }
  .van-list__finished-text {
    text-align: center;
  }

  .no-data {
    text-align: center;
    color: #999999;
    height: px2rem(500);
    // line-height: px2rem(500);
    .blue-btn {
      color: #5a96dc;
      padding: 0 px2rem(20);
    }
    .no-data-text {
      line-height: px2rem(300);
    }
  }
}
</style>
