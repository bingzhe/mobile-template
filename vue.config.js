const path = require("path");

module.exports = {
  chainWebpack: config => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type => addStyleResource(config.module.rule("scss").oneOf(type)));
  },
  // baseUrl: '/assistant/',
  publicPath: '/assistant/',
  outputDir: undefined,
  assetsDir: 'static',
  runtimeCompiler: undefined, 
  productionSourceMap: false,
  parallel: undefined,
  css: undefined
};

function addStyleResource(rule) {
  rule.use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [
        path.resolve(__dirname, "./src/styles/mixin.scss"),
      ],
    });
}