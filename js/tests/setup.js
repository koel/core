// setup JSDOM
require('jsdom-global')()

// make sure polyfill is loaded before generators
require('babel-polyfill')

require('chai').should()

require('vue-test-helpers')()

// make common utils available globally as well
global.Vue = require('vue')
global.expect = require('expect')
global.sinon = require('sinon')
global._ = require('lodash')
window.__UNIT_TESTING__ = true

const noop = () => {}

// Stub components and directives so that rendering will not yell at us.
global.Vue.component('virtual-scroller', {
  render: h => noop
})

global.Vue.directive('koel-focus', noop)
global.Vue.directive('koel-clickaway', noop)

global.stub = (object, method) => {
  if (object[method] === undefined) {
    throw new Error(method + ' ' + ' is not a function.')
  }

  // make sure we don't double-wrap a method, for whatever reason.
  if (typeof object[method].restore === 'function') {
    object[method].restore()
  }

  return global.sinon.stub(object, method)
}
