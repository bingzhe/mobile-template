<template>
    <div class="v-stepper flex-box main-space cross-center">
        <div class="minus flex-box cross-center">
            <img 
                v-show="!minusDisabled"
                @click="onChange('minus')"
                class="img minus-btn" 
                src="@/assets/minus.png" 
            />
        </div>
        <div class="display">{{ currentValue }}</div>
        <div class="plus flex-box cross-center">
            <img  
                v-show="!plusDisabled"
                @click="onChange('plus')" 
                class="img plus-btn" 
                src="@/assets/plus.png" 
            />
        </div>
    </div>
</template>

<script>
import Util from "@/config/util.js";

export default {
  props: {
    value: null,
    integer: { type: Boolean, default: true },
    min: {
      type: [String, Number],
      default: 0
    },
    max: {
      type: [String, Number],
      default: Infinity
    },
    step: {
      type: [String, Number],
      default: 1
    },
    defaultValue: {
      type: [String, Number],
      default: 1
    }
  },

  data() {
    const value = Util.isDef(this.value) ? this.value : this.defaultValue;

    if (value !== +this.value) {
      this.$emit("input", value);
    }

    return {
      currentValue: value
    };
  },
  computed: {
    minusDisabled() {
      return this.currentValue <= this.min;
    },

    plusDisabled() {
      return this.currentValue >= this.max;
    }
  },
  watch: {
    value(val) {
      if (val !== this.currentValue) {
        this.currentValue = this.format(val);
      }
    },

    currentValue(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    }
  },
  methods: {
    format(value) {
      value = String(value).replace(/[^0-9.-]/g, "");
      return value === "" ? 0 : this.integer ? Math.floor(value) : +value;
    },
    range(value) {
      return Math.max(Math.min(this.max, this.format(value)), this.min);
    },

    onChange(type) {
      if (this[`${type}Disabled`]) {
        return;
      }

      const diff = type === "minus" ? -this.step : +this.step;
      const value = Math.round((this.currentValue + diff) * 100) / 100;

      this.currentValue = this.range(value);
    }
  }
};
</script>


<style lang="scss" scoped>
.v-stepper {
  width: px2rem(300);
  height: px2rem(60);
  .minus,
  .plus {
    width: px2rem(48);
    .img {
      height: px2rem(48);
      width: px2rem(48);
    }
  }
  .display {
    box-sizing: border-box;
    height: px2rem(60);
    width: px2rem(150);
    text-align: center;
    line-height: px2rem(60);
    border: 1px solid #5a96dc;
    font-size: px2rem(30);
    color: #333;
  }
}
</style>

