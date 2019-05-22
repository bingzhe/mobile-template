import wx from "weixin-js-sdk";
import dayjs from "dayjs";

import http from "@/config/encsubmit";
import Util from "@/config/util";

class WxConfig {

  static getInstance() {
    if (!WxConfig.instance) {
      WxConfig.instance = new WxConfig();
    }
    return WxConfig.instance;
  }

  constructor() {
    // this.share_url = `http://customer${window.full_url}`;
  }

  //配置
  config() {
    let appid = "";
    let sign = "";

    let noncestr = Util.GetRandString(16);
    // let timestamp = moment().format("X");
    let timestamp = dayjs().unix();

    let url = window.location.href;
    url = url.split("#")[0];

    // let data = {
    //   get_sign: 1,
    //   noncestr: noncestr,
    //   timestamp: timestamp,
    //   url: url,
    // };

    //后台签名
    http.DataEncSubmit(
      "assistant/sign_get.php",
      {
        get_sign: 1,
        noncestr: noncestr,
        timestamp: timestamp,
        url: url,
      },
      resp => {
        if (resp.ret === 0) {
          appid = resp.data.appid;
          sign = resp.data.sign;

          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appid, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noncestr, // 必填，生成签名的随机串
            signature: sign, // 必填，签名，见附录1
            jsApiList: ["scanQRCode", "getLocation", "openLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
        } else {
          console.error("微信sdk配置错误");
        }
      });
  }

  //调用微信扫一扫
  scanQRCode() {
    return new Promise((resolve, reject) => {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          let str = result.split(",")[1];
          resolve(str);
        },
        fail: function (err) {
          reject(err);
        }
      });
    });
  }

  //定位
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          let point = {
            lat: res.latitude,
            lng: res.longitude,
            accuracy: res.accuracy
          };
          resolve(point);
          // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed; // 速度，以米/每秒计
          // var accuracy = res.accuracy; // 位置精度
        },
        fail: function (err) {
          reject(err);
        }
      });
    });
  }

  //打开定位
  openLocation(lat, lng) {
    wx.openLocation({
      latitude: lat, // 纬度，浮点数，范围为90 ~ -90
      longitude: lng, // 经度，浮点数，范围为180 ~ -180。
      // name: '', // 位置名
      // address: '', // 地址详情说明
      scale: 13, // 地图缩放级别,整形值,范围从1~28。默认为最大
      // infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    });
  }

}

export default WxConfig.getInstance();