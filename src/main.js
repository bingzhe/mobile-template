// import VConsole from "vconsole";
// new VConsole();

import "@babel/polyfill";
import Es6Promise from "es6-promise";
Es6Promise.polyfill();
// URLSearchParams()
import "url-search-params-polyfill";
import "@/config/polyfill.js";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import "./config/rem.js";
import "./styles/common.scss"; //公共样式
// import "./config/pagestore.js";
import "vant/lib/index.css";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import * as filters from "@/config/filters"; // global filters

import { getSysCfg } from "./api/api";

import WxConfig from "@/config/wxConfig";
import wx from "weixin-js-sdk";

import loadMap from "@/config/loadTenMap.js";

import Vant from "vant";
Vue.use(Vant);
Vue.config.productionTip = false;

// 全局过滤器 注册.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

//存token
let url = window.location.href;
let urlParams = new URLSearchParams(url);
let token = urlParams.get("token");
if (token) {
  window.Store.SetGlobalData("token", token);
}

//取权限
router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && to.path !== "/operators") {
    if (JSON.stringify(store.state.sysPermision) === "{}") {
      store.dispatch("getAccess").then(() => { next(); });
    } else {
      next();
    }
  } else {
    next();
  }
});

async function initVue() {
  try {
    await getSysCfg();
  } catch (error) {
    console.error(error);
  }

  loadMap().then(() => {
    new Vue({
      router,
      store,
      render: h => h(App),
      created: () => {
        //自定义微信分享
        WxConfig.config();
        wx.ready(() => {
          // wxConfig.shareMessage();
          // wxConfig.shareTimeline();
          store.commit("TOGGLE_WXSDKSTATUS", { wxSdkConfig: true });
          // console.log("微信sdk配置成功");
        });
      }
    }).$mount("#app");
  });
}

initVue();