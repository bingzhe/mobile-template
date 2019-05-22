<template>
  <div class="dialog-day-select">
    <van-picker
      show-toolbar
      title="请选择设定时间"
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="onCancel"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
export default {
  props: {
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      columns: [
        { text: "1天" },
        { text: "2天" },
        { text: "3天" },
        { text: "4天" },
        { text: "5天" },
        { text: "6天" },
        { text: "7天" },
        { text: "8天" },
        { text: "9天" },
        { text: "10天" },
        { text: "11天" },
        { text: "12天" },
        { text: "13天" },
        { text: "14天" },
        { text: "15天" },
        { text: "16天" },
        { text: "17天" },
        { text: "18天" },
        { text: "19天" },
        { text: "20天" }
      ]
    };
  },
  methods: {
    onCancel() {
      this.$emit("on-cancel");
    },
    onConfirm(item, index) {
      this.$emit("on-confirm", index);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-day-select {
  width: px2rem(750);
  padding: 0 px2rem(19);
  box-sizing: border-box;
}
</style>


