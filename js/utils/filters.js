import { isObject, isNumber, get } from "lodash"

export const orderBy = (arr, sortKey, reverse) => {
  if (!sortKey) {
    return arr
  }

  const order = reverse && reverse < 0 ? -1 : 1

  // sort on a copy to avoid mutating original array
  return arr.slice().sort((a, b) => {
    if (sortKey instanceof Array) {
      const diff = sortKey.reduce((accumulator, sort_by) => {
        if (accumulator === 0) {
          accumulator = compareRecordsByKey(a, b, sort_by)
        }
        return accumulator
      }, 0)

      return diff === 0 ? 0 : diff === true ? order : -order
    }

    a = isObject(a) ? get(a, sortKey) : a
    b = isObject(b) ? get(b, sortKey) : b

    if (isNumber(a) && isNumber(b)) {
      return compareAscOrDesc(a, b, order)
    }

    const lowercase_a = lowerCaseIfDefined(a)
    const lowercase_b = lowerCaseIfDefined(b)

    return compareAscOrDesc(lowercase_a, lowercase_b, order)
  })
}

const compareRecordsByKey = (a, b, key) => {
  const aKey = isObject(a) ? get(a, key) : a
  const bKey = isObject(b) ? get(b, key) : b

  if (isNumber(aKey) && isNumber(bKey)) {
    return aKey === bKey ? 0 : aKey > bKey
  }

  const lowercase_a = lowerCaseIfDefined(aKey)
  const lowercase_b = lowerCaseIfDefined(bKey)

  return lowercase_a === lowercase_b ? 0 : lowercase_a > lowercase_b
}

const compareAscOrDesc = (a, b, order) =>
  a === b ? 0 : a > b ? order : -order

const lowerCaseIfDefined = uppercase =>
  uppercase === undefined ? uppercase : uppercase.toString().toLowerCase()

export const limitBy = (arr, n, offset = 0) => arr.slice(offset, offset + n)

export const filterBy = (arr, search, ...keys) => {
  if (!search) {
    return arr
  }

  search = `${search}`.toLowerCase()

  return arr.reduce((res, item) => {
    // use .some() because it will stop at a truthy value (res.push(item) will be truthy)
    keys.some(key => `${get(item, key)}`.toLowerCase().includes(search) && res.push(item))
    return res
  }, [])
}

export const pluralize = (...args) => {
  if (!args[0] || args[0] > 1) {
    return `${args[0]} ${args[1]}s`
  }

  return `${args[0]} ${args[1]}`
}
