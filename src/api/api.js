import http from "@/config/encsubmit";

//get_web_cfg
export const getSysCfg = function () {
  return new Promise((resolve, reject) => {
    http.DataEncSubmit("syscfg_get.php", { opr: "get_web_cfg" }, resp => {
      if (0 === resp.ret) {
        window.full_url = `.${resp.data.primary_domain}`;
        resolve(resp);
      } else {
        reject(resp);
      }
    });
  });
};

// ============================================================================

export const vendorGoodsGet = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/vendor_goods_get.php", data, resp => {
      resolve(resp);
    });
  });
};

// aisle_get
export const aisleGet = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/aisle_get.php", data, resp => {
      resolve(resp);
    });
  });
};

// aisle_save
export const aisleSave = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/aisle_save.php", data, resp => {
      resolve(resp);
    });
  });
};

//vendor_get
export const vendorGet = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/vendor_get.php", data, resp => {
      resolve(resp);
    });
  });
};

//vendor_save
export const vendorSave = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/vendor_save.php", data, resp => {
      resolve(resp);
    });
  });
};

//vendor_order_get
export const vendorOrderGet = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/vendor_order_get.php", data, resp => {
      resolve(resp);
    });
  });
};

//fault_get
export const faultGet = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/fault_get.php", data, resp => {
      resolve(resp);
    });
  });
};

//fault_save
export const faultSave = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/fault_save.php", data, resp => {
      resolve(resp);
    });
  });
};

// return_record_save
export const returnRecordSave = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/return_record_save.php", data, resp => {
      resolve(resp);
    });
  });
};

// return_record_get
export const returnRecordGet = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/return_record_get.php", data, resp => {
      resolve(resp);
    });
  });
};

//vendor_goods_category_get
export const vendorGoodsGategoryGet = function (data) {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/vendor_goods_category_get.php", data, resp => {
      resolve(resp);
    });
  });
};

//vendor_record_get
export const vendorRecordGet = function (data) {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/vendor_record_get.php", data, resp => {
      resolve(resp);
    });
  });
};

//vendor_board
export const vendorBoard = function (data) {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/vendor_board.php", data, resp => {
      resolve(resp);
    });
  });
};

//login_save
export const loginSave = function (data) {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/login_save.php", data, resp => {
      resolve(resp);
    });
  });
};

//employee_get
export const employeeGet = function (data) {
  return new Promise((resolve) => {
    http.DataEncSubmit("assistant/employee_get.php", data, resp => {
      resolve(resp);
    });
  });
};