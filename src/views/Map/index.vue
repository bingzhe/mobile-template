<template>
  <div id="map-page">
    <base-header head-title="位置信息">
      <template slot="right">
        <div></div>
      </template>
    </base-header>

    <div id="map-container"></div>

    <div class="nav-content flex-box">
      <div class="nav-address item-grow flex-box cross-center main-center">
        <span>{{address}}</span>
      </div>
      <div class="nav-icon flex-none flex-box cross-center main-center" @click="openMapSelect">
        <img class="arrow-icon" src="@/assets/arrow_1.png">
      </div>
    </div>

    <van-popup class="change-default-dailog-custom" v-model="showMapSelect" position="bottom">
      <div class="map-select">
        <div class="map-item">
          <a :href="baiduAndroidUrl">百度地图</a>
        </div>
        <div class="map-item">
          <a href>高德地图</a>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import WxConfig from "@/config/wxConfig";
import { mapState } from "vuex";

export default {
  components: {
    BaseHeader
  },
  data() {
    return {
      locationPoint: { lat: 22.56329, lng: 113.88308 },

      address: "",

      showMapSelect: false,

      map: null
    };
  },
  computed: {
    ...mapState({
      wxSdkConfig: state => state.wxSdkConfig,
      mapPointList: state => state.mapPointList
    }),
    baiduAndroidUrl() {
      return `bdapp://map/geocoder?src=andr.sailing.assistant&address=${
        this.address
      }`;
    }
  },
  watch: {
    wxSdkConfig: function (val) {
      if (val) {
        this.getLocation();
      }
    }
  },
  mounted() {
    /**
     * 微信sdk配置好定位到
     */
    if (this.wxSdkConfig) {
      this.getLocation();
    }
    this.init();
  },
  methods: {
    init() {
      let _this = this;

      let myLatlng = new qq.maps.LatLng(
        this.locationPoint.lat,
        this.locationPoint.lng
      );
      let mapOptions = {
        zoom: 13,
        center: myLatlng,

        //地图类型控件
        mapTypeControl: false,
        //缩放控件
        zoomControl: false
        // 启用比例尺
        // scaleControl: true,
        // scaleControlOptions: {
        //   //设置控件位置相对右下角对齐，向左排列
        //   position: qq.maps.ControlPosition.RIGHT_BOTTOM
        // }
      };

      this.map = new qq.maps.Map(
        document.getElementById("map-container"),
        mapOptions
      );

      for (let i = 0; i < this.mapPointList.length; i++) {
        const point = this.mapPointList[i];
        const latlng = new qq.maps.LatLng(point.lat, point.lng);

        const marker = new qq.maps.Marker({
          position: latlng,
          map: this.map
        });

        marker.text = point.text;

        qq.maps.event.addListener(marker, "click", function (event) {
          _this.address = event.target.text;
        });
      }

      if (this.mapPointList && this.mapPointList.length === 1) {
        this.map.setCenter(
          new qq.maps.LatLng(this.mapPointList[0].lat, this.mapPointList[0].lng)
        );
      }
    },
    openMapSelect() {
      if (this.address) {
        this.showMapSelect = true;
      }
    },
    //定位
    getLocation() {
      WxConfig.getLocation().then(point => {
        this.locationPoint = point;
        this.setMapCenter(this.locationPoint);
      });
    },
    //设置地图中心点
    setMapCenter(point) {
      let centerPoint = new qq.maps.LatLng(point.lat, point.lng);
      if (this.map) {
        this.map.setCenter(centerPoint);

        // new qq.maps.Marker({
        //   position: centerPoint,
        //   map: this.map
        // });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#map-page {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  padding: px2rem(88) 0 px2rem(160);
  box-sizing: border-box;
}
#map-container {
  height: 100%;
  width: 100%;
}
.nav-content {
  height: px2rem(160);
  width: 100%;
  .nav-address {
    text-align: center;
    font-size: px2rem(38);
    padding: 0 px2rem(50);
  }
  .nav-icon {
    width: px2rem(160);
    .arrow-icon {
      height: px2rem(100);
      width: px2rem(100);
    }
  }
}
.map-select {
  .map-item {
    height: px2rem(80);
    line-height: px2rem(80);
    text-align: center;
    a {
      color: #323232;
      font-size: px2rem(36);
    }
  }
  padding: px2rem(60) px2rem(14);
}
</style>
<style lang="scss">
#map-page {
  .change-default-dailog-custom.van-popup {
    border-radius: px2rem(20) px2rem(20) 0 0;
  }
}
</style>

