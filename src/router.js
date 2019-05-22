import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("./views/Index/index.vue")
    },
    //登陆
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./views/Login/index.vue")
    },
    //运营商选择
    {
      path: "/operators",
      name: "operators",
      component: () => import("./views/Login/OperatorSelect.vue")
    },
    //我的记录
    {
      path: "/record",
      name: "record",
      component: () => import("./views/MyRecord/index.vue")
    },
    //订单管理
    {
      path: "/order",
      name: "order",
      component: () => import("./views/Order/index.vue")
    },
    //订单详情
    {
      path: "/order/detail",
      name: "orderdetail",
      component: () => import("./views/Order/orderdetail.vue")
    },

    //补货首页
    {
      path: "/replenish",
      name: "replenish",
      component: () => import("./views/ReplenishIndex/index.vue")
    },
    //补货操作
    {
      path: "/replenish/handle",
      name: "replenishhandle",
      component: () => import("./views/ReplenishGoods/index.vue")
    },
    //现场维修
    {
      path: "/repair",
      name: "repair",
      component: () => import("./views/Repair/list.vue")
    },
    //现场维修处理
    {
      path: "/repair/handle",
      name: "repairhandle",
      component: () => import("./views/Repair/handle.vue")
    },
    //故障派单
    {
      path: "/repairorder",
      name: "repairorder",
      component: () => import("./views/RepairOrder/list.vue")
    },
    //运营报表
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/Dashboard/index.vue")
    },
    //退货列表
    {
      path: "/returngoods",
      name: "returngoods",
      component: () => import("./views/ReturnGoods/list.vue")
    },
    //商品库存
    {
      path: "/stockgoods",
      name: "stockgoods",
      component: () => import("./views/StockGoods/list.vue")
    },
    //设备列表
    {
      path: "/vendor",
      name: "vendor",
      component: () => import("./views/VendorList/index.vue")
    },
    //电子称校准
    {
      path: "/scaleset",
      name: "scaleset",
      component: () => import("./views/Set/ScaleSet.vue")
    },
    //运营设置
    {
      path: "/oprset",
      name: "oprset",
      component: () => import("./views/Set/OprSet.vue")
    },
    //温度设置
    {
      path: "/temperaset",
      name: "temperaset",
      component: () => import("./views/Set/TemperatureSet.vue")
    },
    //map
    {
      path: "/map",
      name: "map",
      component: () => import("./views/Map/index.vue")
    },
    //demo
    {
      path: "/demo",
      name: "demo",
      component: () => import("./views/Demo/Demo.vue")
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
