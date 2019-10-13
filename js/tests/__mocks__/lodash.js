const _ = require('lodash')

_.orderBy = jest.fn((collection, order) => collection)
_.shuffle = jest.fn(collection => collection)
_.throttle = jest.fn((func, delay) => func)

module.exports = _
