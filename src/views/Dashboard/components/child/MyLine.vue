<template>
  <div class="line-page" id="line-page">
    <canvas id="mountNode" ref="mountNode"></canvas>
  </div>
</template>

<script>
import F2 from "@antv/f2";
export default {
  props: {
    numList: {
      type: Array,
      default: function () {
        return [
          // {
          //   date: "02:00:00",
          //   value: 116
          // },
          // {
          //   date: "04:00:00",
          //   value: 129
          // }
        ];
      }
    },
    activeTitle: {
      type: String,
      default: "销售量"
    },
    changeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    numList: {
      handler: function () {
        let mountNode = document.getElementById("mountNode");
        if (mountNode) {
          if (this.chart) {
            this.chart.clear();
          }
          this.lintChart();
        }
      },
      deep: true
    }
  },
  mounted() {
    var linePage = document.getElementById("line-page");
    var f2Tooltip = document.createElement("div");
    f2Tooltip.className = "f2-tooltip";
    linePage.appendChild(f2Tooltip);
    this.lintChart();
  },
  methods: {
    lintChart() {
      let _this = this;
      var mountNode = document.getElementById("mountNode");
      var canvasOffsetTop = mountNode.style.top;
      var canvasOffsetLeft = mountNode.style.left;

      this.chart = new F2.Chart({
        id: "mountNode",
        pixelRatio: window.devicePixelRatio,
        padding: ["auto", 40, "auto", "auto"]
      });

      this.chart.source(this.numList, {
        value: {
          min: 0,
        },
        date: {
          type: "cat",
          tickCount: 4
        }
      });

      this.chart.scale({
        value: {
          min: 0
        }
      });
      this.chart.coord("rect");

      this.chart.tooltip({
        custom: true,
        showCrosshairs: false,
        onChange: function onChange(ev) {
          var tooltipEl = document.getElementsByClassName("f2-tooltip");
          var currentData = ev.items[0];
          var text = currentData.value;
          var htmlTag = "";
          if (1 === _this.changeIndex) {
            htmlTag =
              "<span class='title-label'>" +
              currentData.title +
              "</span><span><span>" +
              _this.activeTitle +
              "：  </span><span> " +
              "<span class='text-blue'>￥</span>" +
              text +
              "</span> </span>";
          } else {
            htmlTag =
              "<span class='title-label'>" +
              currentData.title +
              "</span><span><span>" +
              _this.activeTitle +
              "</span><span>： " +
              text +
              "<span class='text-blue'> 笔 </span>" +
              "</span> </span>";
          }

          tooltipEl[0].innerHTML = htmlTag;
          tooltipEl[0].style.opacity = 1;
          tooltipEl[0].style.left =
            canvasOffsetLeft +
            currentData.x -
            tooltipEl[0].offsetWidth / 2 +
            "px";
          tooltipEl[0].style.top =
            canvasOffsetTop +
            currentData.y -
            tooltipEl[0].offsetHeight / 2 -
            15 +
            "px";
        },
        onHide: function onHide() {
          var tooltipEl = document.getElementsByClassName("f2-tooltip");
          if (tooltipEl[0]) {
            tooltipEl[0].style.opacity = 0;
          }
        }
      });

      this.chart.axis("date", {
        label: function label(text, index, total) {
          var textCfg = {};
          if (index === 0) {
            textCfg.textAlign = "start";
          } else if (index === total - 1) {
            textCfg.textAlign = "end";
          }
          return textCfg;
        },
      });

      this.chart.line().position("date*value");
      this.chart.render();
    }
  }
};
</script>

<style lang="scss" scoped>
#mountNode {
  width: px2rem(750) !important;
}
</style>
<style lang="scss">
.line-page {
  .f2-tooltip {
    position: absolute;
    z-index: 99;
    padding: px2rem(21) px2rem(10);
    text-align: center;
    // width: px2rem(200);
    // height: px2rem(120);
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(90, 150, 220, 1);
    border-radius: px2rem(18);
    opacity: 0;
    box-sizing: border-box;
  }
  .f2-tooltip:after {
    content: " ";
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #1890ff;
    position: absolute;
    left: 50%;
    margin-left: -6px;
    bottom: -8px;
  }
  .f2-tooltip span {
    display: inline-block;
  }
  .f2-tooltip span.title-label {
    font-size: px2rem(28) !important;
    color: #333333;
    display: block;
    font-weight: bold;
    // margin-left: px2rem(-90);
    margin-bottom: px2rem(21);
  }
  .f2-tooltip span:nth-child(1) {
    font-size: px2rem(28) !important;
    color: #333333;
  }
  .f2-tooltip span:nth-child(2) {
    font-size: px2rem(24) !important;
    color: #5a96dc;
  }
  .f2-tooltip span.text-blue {
    color: #5a96dc;
  }
}
</style>

