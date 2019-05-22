<template>
  <div class="login-page">
    <!-- logo -->
    <div class="logo">
      <img src="@/assets/sailing_logo.png" alt>
    </div>
    <!-- logo -->

    <!-- 登录 -->
    <form class="login-form">
      <div class="login-item flex-box main-space cross-center">
        <div class="item-grow itme-left flex-box cross-center">
          <span class="icon account-icon">账号</span>
          <!-- <span>账号</span> -->
          <input
            class="item-grow"
            type="text"
            placeholder="请输入登录账号"
            @input="clearErrTip"
            v-model.trim="form.username"
          >
        </div>
        <div class="item-right">
          <span v-show="form.username" class="icon clear-icon" @click="clearUsername"></span>
        </div>
      </div>
      <div class="login-item flex-box main-space cross-center">
        <div class="itme-left item-grow flex-box cross-center">
          <span class="icon password-icon">密码</span>
          <!-- <span>密码</span> -->
          <input
            class="item-grow"
            :type="passwordType"
            @input="getmd5Password"
            placeholder="请输入登录密码"
            v-model="form.password"
          >
        </div>
        <div class="item-right flex-box">
          <span v-show="form.password" class="icon delete-icon" @click="clearPassword"></span>
        </div>
      </div>

      <div class="wx-bind">
        <div class="bind-title">绑定微信</div>
        <div class="bind-info flex-box main-space cross-center">
          <div class="wx-image">
            <img v-if="headimgurl" :src="headimgurl">
            <img v-else src="@/assets/wx.png">
          </div>
          <div class="wx-name">{{nickname}}</div>
          <div class="wx-bind-btn" @click="toggleBind(0)" v-if="isWxChecked">
            <img src="@/assets/checked.png">
          </div>
          <div v-else class="wx-bind-btn" @click="toggleBind(1)">
            <img src="@/assets/unchecked.png">
          </div>
        </div>
      </div>
    </form>
    <!-- 登录 -->

    <div class="v-button large-round" @click="loginOpr">立即登录</div>
  </div>
</template>

<script>
import { isWxBind, errcode } from "@/config/cfg";
import Crypt from "@/config/encrypt";
import { loginSave } from "@/api/api";
import { Public } from "@/config/public";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        passwordmd5: ""
      },
      isWxChecked: true,
      passwordType: "password",

      errorText: "",
      typeSelect: 1,
      typeOptions: [
        {
          label: isWxBind.toString(isWxBind.YES),
          value: isWxBind.YES,
          imgyes: "@/assets/checked.png",
          imgno: "@/assets/unchecked.png"
        },
        {
          label: isWxBind.toString(isWxBind.NO),
          value: isWxBind.NO,
          imgyes: "@/assets/checked.png",
          imgno: "@/assets/unchecked.png"
        }
      ],

      query: {},

      headimgurl: "",
      nickname: "",
      wxid: ""
    };
  },
  computed: {
    isShowLoginBtn() {
      if (this.form.username && this.form.password) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.checkLogin();
  },
  methods: {
    clearErrTip() {
      this.errorText = "";
    },

    checkLogin() {
      /**
       * 头像，nickname
       * 1. 检查url上是否有， 有的时候存本地
       * 1. 展示的的从本地取
       */

      this.query = this.$route.query;

      // if (this.query.token) {
      //   window.Store.SetGlobalData("token", this.query.token);
      // }
      if (this.query.headimgurl) {
        window.Store.SetGlobalData("headimgurl", this.query.headimgurl);
      }
      if (this.query.nickname) {
        window.Store.SetGlobalData("nickname", this.query.nickname);
      }
      if (this.query.wx_id) {
        window.Store.SetGlobalData("wxid", this.query.wx_id);
      }

      this.headimgurl = window.Store.GetGlobalData("headimgurl");
      this.nickname = window.Store.GetGlobalData("nickname");
      this.wxid = window.Store.GetGlobalData("wxid");

      if (this.query.ret == "-200310") {
        this.$toast({
          message: "该账号正在使用，无法重复登录",
          duration: 3000
        });
      }

      if (this.query.ret < 0 && this.query.ret !== "-20062") {
        this.$toast({
          message: errcode.toString(this.query.ret),
          duration: 2000
        });
      }
    },

    clearUsername() {
      this.form.username = "";
    },
    getmd5Password() {
      this.form.passwordmd5 = Crypt.Md5(this.form.password);
      this.clearErrTip();
    },
    clearPassword() {
      this.form.password = "";
    },
    //是否绑定微信
    toggleBind(value) {
      this.typeSelect = value;
      this.isWxChecked = !this.isWxChecked;
    },
    loginOpr() {
      if (!this.form.username || !this.form.password) {
        this.$toast({
          message: "账号密码不能为空",
          duration: 2000
        });
        return;
      }

      let data = {
        login_save: 1,
        phone: this.form.username, //账号或手机号
        password_md5: this.form.passwordmd5, //密码
        token: window.Store.GetGlobalData("token") //16位唯一token
      };

      if (this.typeSelect === isWxBind.YES) {
        data["weixin_id"] = this.wxid;
      }

      console.log("登录 req=>", data);
      loginSave(data).then(resp => {
        // console.log("登录 res=>", resp);

        if (resp.ret === 0) {
          /**
           * 1.如果shop端 只返userid
           * 2.如果是自己平台，会返userid和platfromid
           * 3.userid和platfromid都保存localstore
           */
          let userid = resp.data.userid;
          let platformid = resp.data.platform_id;
          let queryObj = {
            userid: userid,
            type: this.query.type
          };

          Public.setUserid(userid);

          if (platformid) {
            Public.setPlatformid(platformid);
            queryObj.platform_id = platformid;
          } else {
            Public.delPlatformid();
          }

          this.$router.push({
            path: "/operators",
            query: queryObj
          });
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
.login-page {
  text-align: center;
  // logo
  .logo {
    margin: px2rem(106) 0 px2rem(63);
    img {
      width: px2rem(189);
      height: px2rem(76);
    }
  }
  // 登录表单
  .login-form {
    font-size: 0;
    .login-item {
      height: px2rem(84);
      margin: 0 px2rem(60);
      border-bottom: 1px solid #dcdbdb;
      .icon {
        display: inline-block;
        margin-right: px2rem(77);
        font-size: px2rem(30);
        @include wh(px2rem(80), px2rem(46));
        line-height: px2rem(46);
      }
      .item-right {
        .clear-icon {
          @include wh(px2rem(39), px2rem(38));
          margin-right: px2rem(12);
          background: url("../../assets/delete-icon.png");
          background-repeat: no-repeat;
          background-size: cover;
          margin-top: px2rem(-12);
        }
        .delete-icon {
          @include wh(px2rem(39), px2rem(38));
          margin-right: px2rem(12);
          background: url("../../assets/delete-icon.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
        .pwd-hide-icon {
          margin-right: px2rem(12);
          background-repeat: no-repeat;
          background-size: cover;
        }
        .pwd-show-icon {
          margin-right: px2rem(12);
          background-repeat: no-repeat;
          background-size: cover;
        }
      }

      input {
        font-size: px2rem(30);
        border: none;
        outline: none;
      }
      input:-moz-placeholder {
        /* placeholder颜色  */
        color: #c5c8cc;
        /* placeholder字体大小  */
        font-size: px2rem(30);
      }
      input::-moz-placeholder {
        /* placeholder颜色  */
        color: #c5c8cc;
        /* placeholder字体大小  */
        font-size: px2rem(30);
      } /* for the future */
      input:-ms-input-placeholder {
        /* placeholder颜色  */
        color: #c5c8cc;
        /* placeholder字体大小  */
        font-size: px2rem(30);
      }
    }
    .login-item:first-child {
      margin-bottom: px2rem(28);
    }
    // 微信绑定
    .wx-bind {
      font-size: px2rem(32);
      margin-top: px2rem(36);
      margin-bottom: px2rem(295);
      .bind-select {
        // width: px2rem(464);
        margin: 0 px2rem(60);
        border-bottom: 1px solid #dcdbdb;
        .bind-label {
          display: inline-block;
          @include wh(px2rem(150), px2rem(66));
          text-align: center;
          line-height: px2rem(66);
        }
        .bind-item {
          box-sizing: border-box;
          @include wh(px2rem(210), px2rem(66));
          text-align: center;
          line-height: px2rem(66);
          // border: 1px solid $c-bd-orange-a;
          // color: $c-font-orange-a;
          font-size: px2rem(30);
          border-radius: px2rem(33);
        }
        img {
          width: px2rem(30);
          height: px2rem(30);
          // color: #fff;
          // background: linear-gradient(90deg, $c-bg-orange-b, $c-bg-orange-a);
        }
      }
    }
    .wx-bind {
      margin-top: px2rem(92);
      padding-left: px2rem(70);
      padding-right: px2rem(68);
      @include fc(px2rem(30), #c5c8cc);
      .bind-info {
        margin-top: px2rem(33);
        border: px2rem(1) solid #dcdbdb;
        border-left: 0;
        border-right: 0;
        padding: px2rem(10);
      }
      .wx-image {
        img {
          @include wh(px2rem(110), px2rem(110));
        }
      }
      .wx-bind-btn {
        img {
          @include wh(px2rem(30), px2rem(30));
        }
      }
    }
  }

  // 登录按钮
  .login-btn {
    width: px2rem(610);
    height: px2rem(88);
    line-height: px2rem(88);
    background: rgba(255, 111, 6, 1);
    box-shadow: 0 px2rem(1) 0 0 rgba(197, 83, 0, 0.3);
    border-radius: px2rem(10);
    font-size: px2rem(36);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    margin-left: px2rem(57);
  }
}
</style>



    
