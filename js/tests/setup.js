import '@babel/polyfill'
import Vue from 'vue'
import lodash from 'lodash'
import setupVueTestHelper from 'vue-test-helpers'
import { noop } from './__helpers__'
import { focus, clickaway, droppable } from '@/directives'

// make common utils available globally as well
global.Vue = Vue
global._ = lodash
window.__UNIT_TESTING__ = true

global.noop = noop

// Stubs so that rendering will not yell at us.
global.Vue.component('virtual-scroller', {
  render: () => noop
})

global.Vue.directive('koel-focus', focus)
global.Vue.directive('koel-clickaway', clickaway)
global.Vue.directive('koel-droppable', droppable)

setupVueTestHelper()
