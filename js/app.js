import './static-loader'
import Vue from 'vue'
import App from './app.vue'
import { http } from './services'
import { VirtualScroller } from 'vue-virtual-scroller/dist/vue-virtual-scroller'
import GlobalEvents from 'vue-global-events'

Vue.component('virtual-scroller', VirtualScroller)
Vue.component('global-events', GlobalEvents)

if (KOEL_ENV === 'app') {
  Vue.use(require('vue-electron'))
}

Vue.config.productionTip = false

/**
 * For Ancelot, the ancient cross of war
 * for the holy town of Gods
 * Gloria, gloria perpetua
 * in this dawn of victory
 */
new Vue({
  el: '#app',
  render: h => h(App),
  created: () => http.init()
})
