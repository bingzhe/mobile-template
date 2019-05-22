export const Public = {
  //店铺id
  getShopid: () => {
    return window.Store.GetGlobalData("SHOPID");
  },
  setShopid: (v) => {
    return window.Store.SetGlobalData("SHOPID", v);
  },
  delShopid: () => {
    return window.Store.DeleteGlobalData("SHOPID");
  },
  //userid
  getUserid: () => {
    return window.Store.GetGlobalData("USERID");
  },
  setUserid: (v) => {
    return window.Store.SetGlobalData("USERID", v);
  },
  delUserid: () => {
    return window.Store.DeleteGlobalData("USERID");
  },
  //platformid
  getPlatformid: () => {
    return window.Store.GetGlobalData("PLATFORMID");
  },
  setPlatformid: (v) => {
    return window.Store.SetGlobalData("PLATFORMID", v);
  },
  delPlatformid: () => {
    return window.Store.DeleteGlobalData("PLATFORMID");
  },
  //use_name
  getUseName: () => {
    return window.Store.GetGlobalData("USENAME");
  },
  setUseName: (v) => {
    return window.Store.SetGlobalData("USENAME", v);
  },
  delUseName: () => {
    return window.Store.DeleteGlobalData("USENAME");
  },
};