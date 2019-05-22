<template>
  <div class="repair-handle">
    <base-header head-title="现场维修"/>
    <div class="gray-bar"></div>
    <!-- 维修结果描述 -->
    <div class="handle-result">
      <div class="handle-title">维修结果描述</div>
      <van-cell-group>
        <van-field type="textarea" v-model="deal_remark" placeholder="请输入维修结果描述..."/>
      </van-cell-group>
    </div>

    <div class="gray-bar height-de"></div>
    <!-- 维修结果描述 -->
    <div class="handle-result">
      <div class="handle-title">维修结果描述</div>
      <ul>
        <li
          class="handel-row flex-box main-space"
          v-for="(item,index) in dealOption"
          :key="item.value"
        >
          <span>{{item.label}}</span>
          <span @click="changeChecked(index,item.value)">
            <img src="@/assets/checked.png" alt v-if="checkedIndex==index">
            <img src="@/assets/unchecked.png" alt v-else>
          </span>
        </li>
      </ul>
    </div>
    <div class="v-button large-round save-btn" @click="goToRepairList">处理完成</div>
  </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader/index.vue";
import { faultSave } from "@/api/api";
import { errcode } from "@/config/cfg";
export default {
  components: {
    BaseHeader
  },
  data() {
    return {
      deal_remark: "",
      checkedIndex: 0,
      deal_status: 3,
      dealOption: [
        {
          label: "设备已恢复正常",
          value: 3
        },
        {
          label: "该设备故障我处理不了",
          value: 1
        }
      ]
    };
  },
  methods: {
    changeChecked(index, value) {
      this.checkedIndex = index;
      this.deal_status = value;
      console.log(this.deal_status);
    },
    goToRepairList() {
      if (!this.deal_remark) {
        this.$toast({
          message: "请输入维修结果描述",
          duration: 2000
        });
        return;
      }
      let data = {
        save_deal: 1, //参数
        fault_id: this.$route.query.fault_id, //故障列表里面获取id
        deal_name: this.$route.query.deal_name, //故障列表里面获取id
        deal_remark: this.deal_remark, //维修结果描述
        deal_status: this.deal_status //1不能处理,3.处理完成
      };
      faultSave(data).then(resp => {
        if (resp.ret === 0) {
          this.$router.go(-1);
        } else {
          this.$toast({
            message: errcode.toString(resp.ret),
            duration: 2000
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
}
div.gray-bar {
  margin-top: px2rem(88);
  height: px2rem(14);
  background: #eeeeee;
}
div.height-de {
  margin-top: px2rem(0);
  height: px2rem(10);
}
.handle-result {
  padding: px2rem(36) px2rem(19);
  font-size: px2rem(32);

  .handle-title {
    color: #323232;
    margin-bottom: px2rem(17);
  }
  .handel-row {
    height: px2rem(68);
    line-height: px2rem(68);
    width: px2rem(690);
    margin-top: px2rem(23);
    border-bottom: px2rem(1) solid rgba(138, 138, 138, 0.2);
    img {
      width: px2rem(40);
      height: px2rem(40);
    }
  }
}
.save-btn {
  margin-top: px2rem(80);
  margin-left: px2rem(69);
  // position: fixed;
  // bottom: px2rem(80);
  // left: px2rem(69);
}
</style>
<style lang="scss">
.repair-handle {
  .van-field__control {
    width: px2rem(668);
    height: px2rem(340);
    padding: px2rem(27) px2rem(32);
    background: rgba(246, 246, 246, 1);
  }
  .van-hairline--top-bottom::after {
    border: none;
  }
  .van-radio__input {
    position: absolute;
    right: px2rem(40);
  }
}
</style>
