import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

import axios from 'axios';
Vue.prototype.$http = axios;

import util from './components/utils.js'
Vue.prototype.$util = util;

//import css
import 'vue-beauty/package/style/vue-beauty.min.css'

//import components
import vueBeauty from 'vue-beauty'
Vue.use(vueBeauty)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')