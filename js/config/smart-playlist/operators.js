export const is = {
  operator: 'is',
  label: 'is'
}

export const isNot = {
  operator: 'isNot',
  label: 'is not'
}

export const contains = {
  operator: 'contains',
  label: 'contains'
}

export const notContain = {
  operator: 'notContain',
  label: 'does not contain'
}

export const isBetween = {
  operator: 'isBetween',
  label: 'is between',
  inputs: 2
}

export const isGreaterThan = {
  operator: 'isGreaterThan',
  label: 'is greater than'
}

export const isLessThan = {
  operator: 'isLessThan',
  label: 'is less than'
}

export const beginsWith = {
  operator: 'beginsWith',
  label: 'begins with'
}

export const endsWith = {
  operator: 'endsWith',
  label: 'ends with'
}

export const inLast = {
  operator: 'inLast',
  label: 'in the last',
  type: 'number', // overriding
  unit: 'days'
}

export const notInLast = {
  operator: 'notInLast',
  label: 'not in the last',
  type: 'number', // overriding
  unit: 'days'
}

export default [
  is, isNot, contains, notContain, isBetween, isGreaterThan, isLessThan, beginsWith, endsWith, inLast, notInLast
]
