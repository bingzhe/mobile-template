import Vue from "vue";
import Vuex from "vuex";
import { SHOP_K, PL_K } from "@/components/Permission";
import { employeeGet } from "@/api/api";
import { Public } from "@/config/public";
import { VENDOR } from "@/config/cfg";

import {
  TOGGLE_WXSDKSTATUS,
  SET_MAPPOINTLIST,
  TOGGLE_WEBSOCK,
  SET_SYSPERMISION,
  SET_CUIHUI
} from "./mutation-types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    wxSdkConfig: false, //wxskd是否配置好

    mapPointList: [], //地图上标注的点

    websockInit: false, //is websocs init suc

    sysPermision: {}, //权限

    isCuihui: 0, //是不是萃会
  },
  mutations: {
    [TOGGLE_WXSDKSTATUS](state, payload) {
      state.wxSdkConfig = payload.wxSdkConfig;
    },
    [SET_MAPPOINTLIST](state, payload) {
      state.mapPointList = payload.mapPointList;
    },
    [TOGGLE_WEBSOCK](state, payload) {
      state.websockInit = payload.websockInit;
    },
    [SET_SYSPERMISION](state, payload) {
      state.sysPermision = payload.sysPermision;
    },
    [SET_CUIHUI](state, payload) {
      state.isCuihui = payload.isCuihui;
    }
  },
  actions: {
    getAccess({ commit, state }) {
      return new Promise(resolve => {
        // let sysPermision = state.sysPermision;

        let shopId = Public.getShopid();
        let data = {
          get_employee_info: 1,
          shop_id: shopId
        };

        console.log("所有权限=> req", data);
        employeeGet(data).then(resp => {
          console.log("所有权限=> res", resp);

          if (0 === resp.ret) {
            let access = {};

            let info = resp.data.info || {};
            let isCuihui = resp.data.is_cuihui;
            let is_admin = info.is_admin;
            let position_permission = info.position_permission || {}; //sh888 权限
            let position_list = info.position_list || []; //shop 权限

            //运营配置入口权限现在全部设为为1
            // access[SHOP_K["ASSIS_HOME_OPRSET"]] = 1;
            // access[PL_K["ASSIS_HOME_OPRSET"]] = 1;

            //如果是超级管理员
            if (is_admin) {
              for (let key in SHOP_K) {
                if (SHOP_K.hasOwnProperty(key)) {
                  access[SHOP_K[key]] = 1;
                }
              }

              commit("SET_SYSPERMISION", { sysPermision: access });
            } else {

              // shop端是多个权限合并， platform端是一个权限
              if(shopId === VENDOR.shop_id) {
                commit("SET_SYSPERMISION", { sysPermision: position_permission });
              } else {
                const access = {};
                position_list
                  .map(item => item.position_permission)
                  .forEach(permission=>{
                    for (const key in permission) {
                      access[key] = access[key] || permission[key];
                    }
                  });

                commit("SET_SYSPERMISION", { sysPermision: access });
              }
            }

            commit("SET_CUIHUI", { isCuihui: isCuihui });
            resolve();
          } else {
            resolve();
          }

        });
      });
    }
  }
});
