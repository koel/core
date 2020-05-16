/// <reference path="../types.d.ts"/>
import './static-loader'
import Vue, { VNode, CreateElement } from 'vue'
import { http } from '@/services'
import App from './app.vue'

/* eslint no-new: 0 */
new Vue({
  el: '#app',
  render: (h: CreateElement): VNode => h(App),
  created: (): void => http.init()
})
