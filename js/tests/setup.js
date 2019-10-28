import { noop } from './__helpers__'
import { focus, clickaway, droppable } from '@/directives'

require('vue-test-helpers')()

// make common utils available globally as well
global.Vue = require('vue')
global._ = require('lodash')
window.__UNIT_TESTING__ = true

global.noop = noop

// Stubs so that rendering will not yell at us.
global.Vue.component('virtual-scroller', {
  render: h => noop
})

global.Vue.directive('koel-focus', focus)
global.Vue.directive('koel-clickaway', clickaway)
global.Vue.directive('koel-droppable', droppable)
