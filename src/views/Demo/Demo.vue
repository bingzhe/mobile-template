<template>
  <div class="home">
    <router-link to="/">首页</router-link>
    <br>
    <router-link to="/login">登陆</router-link>
    <br>
    <router-link to="/operators">运营商选择</router-link>
    <br>
    <router-link to="/record">我的记录</router-link>
    <br>
    <router-link to="/order">订单管理</router-link>
    <br>
    <router-link to="/replenish">补货首页</router-link>
    <br>
    <router-link to="/replenish/handle">补货操作</router-link>
    <br>
    <router-link to="/repair">现场维修</router-link>
    <br>
    <router-link to="/repair/handle">现场维修处理</router-link>
    <br>
    <router-link to="/repairorder">故障派单</router-link>
    <br>
    <router-link to="/dashboard">运营报表</router-link>
    <br>
    <!-- <router-link to="/shortgoods">缺货设备列表</router-link> <br>  -->
    <!-- <router-link to="/outgoods">断货设备列表</router-link> <br>  -->
    <router-link to="/returngoods">退货列表</router-link>
    <br>
    <router-link to="/stockgoods">商品库存</router-link>
    <br>
    <router-link to="/vendor">设备列表</router-link>
    <br>
    <router-link to="/map">map</router-link>
    <br>

    <p>button</p>

    <div class="button-content">
      <div class="v-button">正常</div>
      <div class="v-button danger">危险</div>
      <div class="v-button warning">警告</div>
      <div class="v-button disabled">禁止</div>
      <br>

      <div class="v-button plain">正常</div>
      <div class="v-button danger plain">危险</div>
      <div class="v-button warning plain">警告</div>
      <br>

      <div class="v-button small">正常</div>
      <br>
      <div class="v-button">正常</div>
      <br>
      <div class="v-button large">正常</div>
      <br>
      <div class="v-button auto">正常</div>
      <br>

      <div class="v-button round">正常</div>
      <div class="v-button large-round">正常</div>
      <br>

      <div class="v-button plain round">正常</div>
      <div class="v-button plain large-round">正常</div>
      <br>

      <div class="v-button">正常</div>
      <div class="v-button plain">正常</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {}
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #409eff;
  font-size: 24px;
}
.button-content {
  .v-button {
    margin-bottom: px2rem(10);
  }
}
</style>
