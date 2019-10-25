import './static-loader'
import Vue from 'vue'
import { http } from '@/services'
import App from './app'

new Vue({
  el: '#app',
  render: h => h(App),
  created: () => http.init()
})
