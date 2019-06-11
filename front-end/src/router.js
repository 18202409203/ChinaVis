import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      children: [{
          path: '/calendar',
          name: 'calendar',
          component: () => import( /* webpackChunkName: "about" */ './views/calendar.vue')
        },
        {
          path: '/conferee',
          name: 'conferee',
          component: () => import( /* webpackChunkName: "about" */ './views/conferee.vue')
        },
        {
          path: '/layout',
          name: 'layout',
          component: () => import( /* webpackChunkName: "about" */ './views/layout.vue')
        },
        {
          path: '/abnormal',
          name: 'abnormal',
          component: () => import( /* webpackChunkName: "about" */ './views/abnormal.vue')
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})