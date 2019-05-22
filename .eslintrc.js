module.exports = {
  root: true,
  env: {
    node: true
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  "globals": {
    "base_url": false,
    "JSEncrypt": false,
    "CryptoJS": false,
    "WeixinJSBridge": false,
    "qq": false,
    "VConsole": false,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "indent": [2, 2, { "SwitchCase": 1 }], //缩进风格
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-empty": 2,
    "no-eq-null": 2,
    "no-new": 0,
    "no-fallthrough": 0,//禁止switch穿透
    "no-unreachable": 2, //不能有无法执行的代码
    "no-control-regex": 0,
    "no-useless-escape": 0,
    "no-undef": 2,
    "use-isnan": 2, //禁止比较时使用NaN，只能用isNaN()
    "no-unused-vars": [2, { "vars": "all", "args": "none" }], //禁止未使用的变量 不检查参数
    "no-undef-init": 2, //变量初始化时不能直接给它赋值为undefined
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
