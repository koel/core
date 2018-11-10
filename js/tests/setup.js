import { noop } from './__helpers__'

require('vue-test-helpers')()

// make common utils available globally as well
global.Vue = require('vue')
global._ = require('lodash')
window.__UNIT_TESTING__ = true

global.noop = noop

// Stub components and directives so that rendering will not yell at us.
global.Vue.component('virtual-scroller', {
  render: h => noop
})

global.Vue.directive('koel-focus', noop)
global.Vue.directive('koel-clickaway', noop)
