<template>
    <div id="map-container"></div>
</template>

<script>
import WxConfig from "@/config/wxConfig";

import { mapState } from "vuex";

export default {
  data() {
    return {
      locationPoint: { lat: 22.55329, lng: 113.88308 }
    };
  },
  computed: {
    ...mapState({
      wxSdkConfig: state => state.wxSdkConfig
    })
  },
  watch: {
    wxSdkConfig: function(val) {
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
      let options = {
        zoom: 13,
        center: myLatlng,
        //地图类型控件
        mapTypeControl: false,
        //缩放控件
        zoomControl: false

        //启用比例尺
        // scaleControl: true,
        // scaleControlOptions: {
        //   //设置控件位置相对右下角对齐，向左排列
        //   position: qq.maps.ControlPosition.LEFT_BOTTOM
        // }
      };

      const map = new qq.maps.Map(
        document.getElementById("map-container"),
        options
      );

      qq.maps.event.addListener(map, "click", function() {
        _this.$emit("map-click");
      });
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
#map-container {
  width: 100%;
  height: 100%;
}
</style>

