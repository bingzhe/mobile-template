<template>
    <div class="sort-dialog-content">
        <div class="sort-dialog-title flex-box main-space">
            <div class="cancel" @click="sortDialogCancelClick">取消</div>
            <div class="label">请选择排列方式</div>
            <div class="confirm" @click="sortDialogConfirmClick">确定</div>
        </div>
        <div class="van-hairline--bottom"></div>
        <van-picker 
            ref="vanPickerCate"
            :columns="sortItemList" 
            @change="onChange"            
        />
    </div>
</template>

<script>
import { VendorStatus } from "@/config/cfg";

export default {
  data() {
    return {
      sortItemList: [
        { text: "按距离从近到远", value: 1 }
        // { text: "按缺货从高到低", value: 2 },
        // { text: "按断货从高到低", value: 3 }
      ],
      vendor_status: null,
      sortValue: 1
    };
  },
  created() {
    this.vendor_status = this.$route.query.status;
    this.init();
  },
  methods: {
    init() {
      let lackPick = { text: "按缺货从高到低", value: 2 };
      let shortPick = { text: "按断货从高到低", value: 3 };

      if (this.vendor_status) {
        if (this.vendor_status === VendorStatus.LACK) {
          this.sortItemList.push(lackPick);
        } else if (this.vendor_status === VendorStatus.SHORT) {
          this.sortItemList.push(shortPick);
        }
      } else {
        this.sortItemList.push(lackPick);
        this.sortItemList.push(shortPick);
      }
    },
    //分类选择弹窗
    onChange(picker, cate) {
      this.sortValue = cate.value;
    },
    sortDialogCancelClick() {
      this.$emit("on-cancel");
    },
    sortDialogConfirmClick() {
      this.$emit("on-confirm", this.sortValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.sort-dialog-content {
  padding: 0 px2rem(20);

  .sort-dialog-title {
    height: px2rem(100);
    line-height: px2rem(100);
    font-size: px2rem(30);
    .cancel {
      color: #393939;
    }
    .label {
      color: #999999;
    }
    .confirm {
      color: #5a96dc;
    }
  }
}
</style>



