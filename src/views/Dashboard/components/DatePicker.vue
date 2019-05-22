<template>
  <div class="date-picker-contet">
    <ul class="flex-box date-select-group">
      <li
        class="select-item"
        :class="{'active':checkedIndex==index}"
        v-for="(item,index) in dateOption"
        @click="changeIndex(index)" 
        :key="item.value"
      >{{item.label}}</li>
    </ul>
    <van-popup class="input-content" v-model="showDatePicker" :overlay="false">
      <div class="date-select-picker">
        <van-field
          v-model="begin_time"
          clearable
          disabled
          label="开始时间"
          :icon="dateIcon"
          placeholder="请选择开始时间"
          @click-icon="chooseDate(0)"
        />
        <van-field
          v-model="end_time"
          clearable
          disabled
          label="结束时间"
          :icon="dateIcon"
          placeholder="请选择结束时间"
          @click-icon="chooseDate(1)"
        />

        <div class="btn-group">
          <div class="v-button plain round ok-btn" @click="SaveDateSelect">确定</div>
          <div class="v-button primary round ok-btn" @click="cancelDateSelect">取消</div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showDateselect" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="confirmSelect"
        @cancel="cancelSelect"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      dateIcon: require("@/assets/date_picker.png"),
      showDatePicker: false,
      showDateselect: false,
      isChooseBegin: true,
      begin_time: "", //开始时间
      end_time: "", //结束时间
      dateOption: [
        {
          label: "今日",
          value: 1
        },
        {
          label: "周",
          value: 2
        },
        {
          label: "月",
          value: 3
        },
        {
          label: "自定义",
          value: 4
        }
      ],
      checkedIndex: 0,
      priceTitle: "今日",
      currentDate: new Date(),
      send_begin_time: "",
      send_end_time: ""
    };
  },
  methods: {
    changeIndex(index) {
      this.checkedIndex = index;
      let obj = {},
        endTime;
      obj["index"] = index;
      if (index === 3) {
        this.showDatePicker = !this.showDatePicker;
      } else {
        this.showDatePicker = false;
      }
      this.begin_time = "";
      this.end_time = "";
      if (index == 1) {
        endTime = new Date(
          this.currentDate.getTime() - 24 * 60 * 60 * 1000 * 6
        ); //前一周
      } else if (index == 2) {
        endTime = new Date(
          this.currentDate.getTime() - 24 * 60 * 60 * 1000 * 29
        ); //后一月
      }

      obj["begin_time"] = dayjs(this.currentDate).format("YYYYMMDD");
      obj["end_time"] = dayjs(endTime).format("YYYYMMDD");
      this.$emit("change-date", obj);
    },
    chooseDate(status) {
      this.showDateselect = true;
      if (status == 0) {
        this.isChooseBegin = true;
      } else {
        this.isChooseBegin = false;
      }
    },

    confirmSelect(value) {
      if (this.isChooseBegin) {
        this.begin_time = dayjs(value).format("YYYY-MM-DD");
      } else {
        this.end_time = dayjs(value).format("YYYY-MM-DD");
      }
      this.showDateselect = false;
    },
    cancelSelect() {
      this.showDateselect = false;
    },
    SaveDateSelect() {
      if (!this.begin_time) {
        this.$toast({
          message: "请选择开始时间",
          duration: 2000
        });
        return;
      }
      if (!this.end_time) {
        this.$toast({
          message: "请选择结束时间",
          duration: 2000
        });
        return;
      }

      this.send_begin_time = dayjs(this.begin_time).format("YYYYMMDD");
      this.send_end_time = dayjs(this.end_time).add(1, "day").format("YYYYMMDD");
      if (this.send_begin_time > this.send_end_time) {
        this.$toast({
          message: "请选择正确结束时间",
          duration: 2000
        });
        this.end_time = "";
        return;
      }
      let obj = {};
      obj["index"] = 3;
      obj["begin_time"] = this.send_begin_time;
      obj["end_time"] = this.send_end_time;
      this.$emit("confirm-select", obj);
      this.showDatePicker = false;
    },
    cancelDateSelect() {
      this.send_begin_time = "";
      this.send_end_time = "";
      this.showDatePicker = false;
    }
  }
};
</script>

<style lang="scss" scoped>
//日期选择器
.date-select-group {
  width: px2rem(562);
  height: px2rem(70);
  line-height: px2rem(70);
  background: rgba(255, 255, 255, 1);
  border: px2rem(2) solid rgba(90, 150, 220, 1);
  border-radius: px2rem(35);
  margin-left: px2rem(65);
  font-size: px2rem(30);

  .select-item {
    width: px2rem(140);
    height: px2rem(70);
    text-align: center;
    border-left: px2rem(1) solid rgba(90, 150, 220, 1);
    border-right: px2rem(1) solid rgba(90, 150, 220, 1);
    &:first-of-type {
      border-top-left-radius: px2rem(35);
      border-bottom-left-radius: px2rem(35);
    }
    &:last-of-type {
      border-top-right-radius: px2rem(35);
      border-bottom-right-radius: px2rem(35);
    }
    &:nth-of-type(2) {
      border-right: 0;
    }
  }
  .active {
    background: #5a96dc;
    color: #fff;
  }
}
.btn-group {
  margin-top: px2rem(20);
  box-sizing: border-box;
  .ok-btn {
    width: px2rem(240);
    height: px2rem(60);
    line-height: px2rem(60);
    margin-right: px2rem(28);
    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>
<style lang="scss">
.date-picker-contet {
  .van-popup.input-content {
    position: absolute;
    top: px2rem(272);
    width: px2rem(560);
    padding: px2rem(2) px2rem(26);
    height: px2rem(300);
    box-shadow: 0px 0px 7px 0px rgba(51, 51, 51, 0.2);
    background: rgba(255, 255, 255, 1);
    border-radius: px2rem(20);
    box-sizing: border-box;
  }
  .van-field__control {
    height: px2rem(60);
    background: rgba(255, 255, 255, 1);
    border: px2rem(1) solid rgba(232, 232, 232, 1);
    border-radius: px2rem(10);
  }
}
</style>