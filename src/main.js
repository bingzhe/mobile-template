import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'

// A modern alternative to CSS resets
import 'normalize.css/normalize.css'
// 公共样式
import './styles/index.scss'
// rem布局
import './config/rem.js'

import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
