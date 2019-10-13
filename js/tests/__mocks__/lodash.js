const _ = require('lodash')

_.shuffle = jest.fn(collection => collection)
_.throttle = jest.fn((func, delay) => func)

module.exports = _
