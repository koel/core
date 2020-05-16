/// <reference path="./types.d.ts"/>
import './static-loader'
import Vue, { VNode, CreateElement } from 'vue'
import App from './app.vue'
import { http } from './services/index'

if (KOEL_ENV === 'app') {
  Vue.use(require('vue-electron'))
}

Vue.config.productionTip = false

/**
 * For Ancelot, the ancient cross of war
 * for the holy town of Gods
 * Gloria, gloria perpetua
 * in this dawn of victorya
 */
/* eslint no-new: 0 */
new Vue({
  el: '#app',
  render: (h: CreateElement): VNode => h(App),
  created: (): void => http.init()
})

if (KOEL_ENV !== 'app' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then((): void => console.log('Service Worker Registered'))
}
