import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/demo'
    },
    {
      path: '/home',
      redirect: '/home/vendor',
      name: 'home',
      component: () => import('./views/Home/Home.vue')
    },
    {
      path: '/demo',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Demo/demo.vue')
    }
  ]
})
