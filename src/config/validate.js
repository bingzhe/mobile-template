const validate = {
  //判断是否为邮箱地址
  isEmail: function (str) {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str);
  },
  //判断是否为身份证号
  isIdCard: function (str) {
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str);
  },
  isPhoneNum: function (str) {
    return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str);
  },
  //判断是否为URL地址
  isUrl: function (str) {
    return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(str);
  },
  //判断是否为空
  isEmpty: function (obj) {
    if (Object.prototype.toString.call(obj) === "[object String]") {
      obj = obj.trim();
      return obj.length === 0;
    }
    if (typeof obj === "undefined" || obj === null) {
      return true;
    }
    return false;
  },
  //判断是固定电话或者11位数字
  isLandLinePhone: function (str) {
    const reg = /^\d{11}$/;
    const reg2 = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
    return reg.test(str) || reg2.test(str);
  },
  //匹配15~20位数字或者大写字母,匹配发票税号
  isInvoiceTaxNum: function (str) {
    const reg = /^[\dA-Z]{15,20}$/;
    return reg.test(str);
  }
};

export default validate;