<template>
  <div class="repair-list">
    <!-- 头部 -->
    <base-header head-title="现场维修"/>
    <!-- 搜索 -->
    <base-search class="base-search" @getScreenBox="getScreenBox" @on-search="searchClickHandle"/>

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
              @goToDeal="goToDeal(contentItem)"
            />
          </div>
        </van-list>
      </van-tab>
    </van-tabs>

    <!-- 距离筛选 -->
    <van-popup v-model="isShowScreenBox" :position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="sortDialogConfirmClick"
        @cancel="sortDialogCancelClick"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TenMap from "@/config/map.js";
import WxConfig from "@/config/wxConfig";
import { faultGet } from "@/api/api";
import { VendorStatus, errcode } from "@/config/cfg";
import { Public } from "@/config/public";
import BaseHeader from "@/components/BaseHeader/index.vue";
import BaseSearch from "@/components/BaseSearch/index.vue";
import ListCard from "./components/listCard.vue";
import { mapState } from "vuex";
export default {
  components: {
    BaseHeader,
    BaseSearch,
    ListCard
  },
  data() {
    return {
      bottom: "bottom",
      VendorStatus,
      active: 0, //tab选中
      page_no: 1,
      page_size: 99,
      locationPoint: { lat: 22.55329, lng: 113.88308 },
      tabList: [
        {
          title: "待处理",
          send_status: 0,
          loading: false,
          finished: true,
          content: [],
          vendorPointList: [],
          promiseList: [],
          vendorDistanceList: []
        },
        {
          title: "已处理",
          send_status: 0,
          loading: false,
          finished: true,
          content: [],
          vendorPointList: [],
          promiseList: [],
          vendorDistanceList: []
        }
      ],
      vendorName: "", //搜索
      isShowScreenBox: false, //弹窗
      sortValue: 1, //排序
      columns: [
        { text: "按设备距离从近到远", value: 1 },
        { text: "按故障时间从长到短", value: 2 }
      ]
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
    this.getList();
  },
  methods: {
    getList(searchValue) {
      let status = this.active === 0 ? 2 : 3;
      let data = {
        get_fault_list: 1, //参数
        login_user: 1, //区分现场维修和其他列表
        shop_id: Public.getShopid(), //店铺id  //测试数据
        deal_status: status, //是否处理(1.未处理（待处理）,3.处理完成)
        page_no: this.page_no,
        page_size: this.page_size

        //用设备列表数据调试
        // page_no: 1,
        // page_size: 99,
        // get_vendor_list: 1
      };
      //是否有搜索
      if (searchValue) {
        data["vendor_name"] = searchValue;
      }
      faultGet(data).then(resp => {
        // vendorGet(data).then(resp => {//用设备列表数据调试
        if (resp.ret === 0) {
          let list = resp.data.fault_list;
          // let list = resp.data.vendor_list; //用设备列表数据调试
          let total = resp.data.total;
          list = list.map(item => {
            item.vendor_status_str = this.VendorStatus.toString(
              item.vendor_status
            );
            item.fault_time_str = dayjs(item.fault_time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );
            item.time_str = dayjs(item.time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );
            let addressStr = `${item.province}${item.city}${item.area}${
              item.address
            }`;
            this.tabList[this.active].promiseList.push(
              TenMap.getPoint(addressStr)
            );
            //地址转为经纬度
            TenMap.getPoint(addressStr).then(point => {
              this.tabList[this.active].vendorPointList.push(point);
              item.point = point;
            });
            return item;
          });

          this.tabList[this.active].content = list;
          // this.tabList[this.active].content = [
          //   ...this.tabList[this.active].content,
          //   ...list
          // ];
          this.tabList[this.active].loading = false;
          this.tabList[this.active].refreshing = false;

          if (this.tabList[this.active].content.length === total) {
            this.tabList[this.active].finished = true;
          }

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
    //定位
    getLocation() {
      return new Promise(resolve => {
        WxConfig.getLocation().then(point => {
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

      Promise.all([
        ...this.tabList[this.active].promiseList,
        pormiseLocation
      ]).then(resp => {
        // console.log("PromiseAll", resp);
        // this.getDistance();
        // console.log("距离计算结果", resp);
        this.tabList[this.active].vendorDistanceList = resp.elements;
        this.tabList[this.active].content.map((vendor, index) => {
          let start = this.locationPoint;
          let end = vendor.point || {};
          TenMap.getMapDistance(start, end)
            .then(resp => {
              let detail = resp.detail || {};
              vendor.distance = detail.distance || 0;
              vendor.duration = detail.duration || 0;

              this.$set(vendor, "distanceStr", vendor.distance / 1000);
              this.$set(vendor, "timeStr", this.getDateDiff(vendor.duration));
            })
            .catch(err => {
              vendor.distance = 0;
              vendor.duration = 0;
            });
        });
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
    searchClickHandle(searchValue) {
      this.getList(searchValue);
    },
    //打开筛选弹框
    getScreenBox() {
      this.isShowScreenBox = true;
    },
    sortDialogCancelClick() {
      this.isShowScreenBox = false;
    },
    sortDialogConfirmClick(val) {
      this.sortValue = val.value;
      /**
       * 距离前端排序
       */
      if (1 === this.sortValue) {
        this.tabList[this.active].content.sort(this.distanceSortFuc);
      } else {
        this.tabList[this.active].content.sort(this.timeSortFuc);
        // this.getList();
        // this.calcuDistance();
      }
      this.isShowScreenBox = false;
    },
    distanceSortFuc(a, b) {
      return a.distance - b.distance;
    },
    timeSortFuc(a, b) {
      return a.time - b.time;
    },
    //点击去处理
    goToDeal(contentItem) {
      this.$router.push({
        path: "/repair/handle",
        query: {
          fault_id: contentItem.fault_id,
          deal_name: contentItem.deal_name
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.base-search {
  margin-top: px2rem(88);
}
</style>
<style lang="scss">
</style>
