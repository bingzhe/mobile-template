import Util from "@/config/util";

class TenMap {
  static getInstance() {
    if (!TenMap.instance) {
      TenMap.instance = new TenMap();
    }
    return TenMap.instance;
  }

  constructor() { }

  /**
   * 地址解析出经纬度
   * @param {String} address 
   */
  getPoint(address) {
    return new Promise((resolve) => {
      let geocoder = new qq.maps.Geocoder({
        complete: function (results) {
          let point = results.detail.location;
          resolve(point);
        }
      });
      geocoder.getLocation(address);
    });

  }

  /**
   * 一对多计算位置距离时间
   * @param {String} from 起点
   * @param {String} to 终点
   */
  getDistance(from, to) {
    return new Promise((resolve, reject) => {
      let url =
        `https://apis.map.qq.com/ws/distance/v1/?mode=driving&from=${from}&to=${to}&output=jsonp&key=UIGBZ-HNXWX-NQ34S-ZP4PT-KKQ2F-NHFX3`;

      Util.Jsonp(url).then(function (resp) {
        if (0 === resp.status) {
          resolve(resp.result);
        } else {
          reject(resp);
        }
      });
    });
  }

  /**
   * 计算距离
   * @param {Object} start {lat:xx,lng:xx}
   * @param {Object} end {lat:xx,lng:xx}
   */

  getMapDistance(start, end) {
    return new Promise((resolve, reject) => {

      let startLatlng = new qq.maps.LatLng(
        start.lat,
        start.lng
      );
      let endLatlng = new qq.maps.LatLng(
        end.lat,
        end.lng
      );

      //设置获取驾车线路方案的服务
      let drivingService = new qq.maps.DrivingService({
        //驾车获取路线的策略（最少时间）
        policy: qq.maps.DrivingPolicy.LEAST_TIME,
        //设置回调函数
        complete: function (result) {
          if (result.type == qq.maps.ServiceResultType.MULTI_DESTINATION) {
            reject("起终点不唯一");
          }
          resolve(result);
        },
        //设置检索失败回调函数
        error: function (data) {
          reject(data);
        },
      });

      drivingService.search(startLatlng, endLatlng);
    });
  }
}

export default TenMap.getInstance();