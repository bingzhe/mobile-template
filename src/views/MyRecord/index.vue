<template>
  <div class="my-record">
    <!-- 头部 -->
    <base-header head-title="我的记录"/>
    <!-- 列表 -->
    <van-tabs v-model="active" class="record-list" @change="changeTabs">
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
              @go-detail="goToDeal(contentItem)"
            />
          </div>
        </van-list>
      </van-tab>
    </van-tabs>

    <van-popup class="detail-page" v-model="isShowDealselectBox" position="right">
      <my-detail
        :activeIndex="active"
        :detailInfo="detailInfo"
        :detailArr="detailArr"
        @on-close="closeDetail"
      />
      <!-- <van-button @click="isShowDealselectBox = false">详情</van-button> -->
    </van-popup>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { vendorRecordGet, returnRecordGet } from "@/api/api";
import { errcode } from "@/config/cfg";
import { Public } from "@/config/public";
import MyDetail from "./detail";
import BaseHeader from "@/components/BaseHeader/index.vue";
import ListCard from "./components/ListCard.vue";
export default {
  components: {
    BaseHeader,
    ListCard,
    MyDetail
  },
  data() {
    return {
      isShowDealselectBox: false, //是否显示处理选项
      bottom: "bottom", //van-popup出来的位置
      active: 0, //tab选中
      page_no: 1, //分页
      page_no_return: 1, // 退货分页
      page_size: 10, //页面显示条数
      detailInfo: {}, //退货的详情
      detailArr: [], //补货详情
      tabList: [
        {
          title: "补货",
          loading: false,
          finished: false,
          content: []
        },
        {
          title: "退货",
          loading: false,
          finished: false,
          content: []
        }
      ]
    };
  },
  created() {
    scroll(0, 0);
    this.getList();
  },

  methods: {
    //拉取补货数据
    getList() {
      let data = {
        get_record_list: 1, //参数
        shop_id: Public.getShopid(), //店铺id  //测试数据
        page_no: this.page_no,
        page_size: this.page_size
      };
      vendorRecordGet(data).then(resp => {
        this.dealWithData(resp);
      });
    },

    //拉取退货数据
    getRecordList() {
      let data = {
        get_return_list: 1, //参数
        shop_id: Public.getShopid(), //店铺id   //测试数据
        return_status: 2, //退货状态(1.待退货中,2.退货成功)
        page_no: this.page_no_return,
        page_size: this.page_size
      };
      returnRecordGet(data).then(resp => {
        this.dealWithData(resp);
      });
    },
    //对拉取过来的数据做处理
    dealWithData(resp) {
      if (resp.ret === 0) {
        let list = resp.data.list;
        let total = resp.data.total || list.length;
        list = list.map(item => {
          if (item.return_time) {
            item.return_time_str = dayjs(item.return_time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );
          }
          if (item.record_time) {
            item.record_time_str = dayjs(item.record_time * 1000).format(
              "YYYY.MM.DD HH:mm"
            );
          }
          return item;
        });

        // this.tabList[this.active].content = list;
        this.tabList[this.active].content = [
          ...this.tabList[this.active].content,
          ...list
        ];
        this.tabList[this.active].loading = false;
        this.tabList[this.active].finished = false;
        if (this.tabList[this.active].content.length === total) {
          this.tabList[this.active].finished = true;
        }
      } else {
        this.$toast({
          message: errcode.toString(resp.ret),
          duration: 2000
        });
      }
    },

    //切换退货和补货
    changeTabs() {
      this.tabList[this.active].content = [];
      if (this.active === 0) {
        this.page_no = 1;
        this.getList();
      } else {
        this.page_no_return = 1;
        this.getRecordList();
      }
    },
    onLoad() {
      // if (this.active === 0&&!this.tabList[this.active].finished) {
      // this.page_no++;
      // this.getList();
      // }else if (this.active === 1&&!this.tabList[this.active].finished) {
      //   this.page_no_return++;
      //   this.getRecordList();
      // }
    },
    //点击去处理
    goToDeal(item) {
      this.isShowDealselectBox = true;
      if (this.active == 0) {
        this.detailInfo = item;
        this.detailArr = item.aisle_list;
      } else {
        this.detailInfo = item;
      }
    },
    //关闭详情
    closeDetail() {
      this.isShowDealselectBox = false;
      this.detailInfo = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.record-list {
  margin-top: px2rem(88);
}
</style>

<style lang="scss">
.my-record {
  .van-tabs {
    margin-top: px2rem(88);
  }
  .van-popup {
    width: 60%;
    // padding: 20px;
    box-sizing: border-box;
    .van-tabs__content {
      height: 156px;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .van-tab__pane:not(:first-child) {
      padding: 10px;
      line-height: 1.4;
      // color: @gray-darker;
    }
    &--right {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
