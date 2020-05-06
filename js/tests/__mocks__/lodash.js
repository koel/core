/* eslint @typescript-eslint/no-unused-vars: 0 */
const _ = require('lodash')

_.orderBy = jest.fn((collection, order) => collection)
_.shuffle = jest.fn(collection => collection)
_.throttle = jest.fn((func, delay) => func)
_.sample = jest.fn(collection => collection.length ? collection[0] : null)

module.exports = _
