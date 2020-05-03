import { isObject, isNumber, get } from 'lodash'

export const orderBy = <T>(arr: T[], sortKey?: string[] | string | null, reverse?: number): T[] => {
  if (!sortKey) {
    return arr
  }

  const order = (reverse && reverse < 0) ? -1 : 1

  const compareRecordsByKey = (a: T, b: T, key: string): number => {
    let aKey = isObject(a) ? get(a, key) : a
    let bKey = isObject(b) ? get(b, key) : b

    if (isNumber(aKey) && isNumber(bKey)) {
      return aKey === bKey ? 0 : Number(aKey > bKey)
    }

    aKey = aKey === undefined ? aKey : `${aKey}`.toLowerCase()
    bKey = bKey === undefined ? bKey : `${bKey}`.toLowerCase()

    return aKey === bKey ? 0 : Number(aKey > bKey)
  }

  // sort on a copy to avoid mutating original array
  return arr.slice().sort((a: T, b: T): number => {
    if (sortKey.constructor === Array) {
      let diff = 0
      for (let i = 0; i < sortKey.length; i++) {
        diff = compareRecordsByKey(a, b, sortKey[i])
        if (diff !== 0) {
          break
        }
      }

      return diff === 0 ? 0 : diff ? order : -order
    }

    let aSortKey = isObject(a) ? get(a, sortKey) : a
    let bSortKey = isObject(b) ? get(b, sortKey) : b

    if (isNumber(aSortKey) && isNumber(bSortKey)) {
      return aSortKey === bSortKey ? 0 : aSortKey > bSortKey ? order : -order
    }

    aSortKey = aSortKey === undefined ? aSortKey : aSortKey.toLowerCase()
    bSortKey = bSortKey === undefined ? bSortKey : bSortKey.toLowerCase()

    return aSortKey === bSortKey ? 0 : aSortKey > bSortKey ? order : -order
  })
}

export const limitBy = <T>(arr: T[], n: number, offset: number = 0): T[] => arr.slice(offset, offset + n)

export const filterBy = <T>(arr: T[], search: string, ...keys: string[]): T[] => {
  if (!search) {
    return arr
  }

  search = `${search}`.toLowerCase()

  return arr.reduce((res: T[], item: T) => {
    // use .some() because it will stop at a truthy value (res.push(item) will be truthy)
    keys.some(key => `${get(item, key)}`.toLowerCase().includes(search) && res.push(item))
    return res
  }, [])
}

export const pluralize = (...args: any[]): string => {
  if (!args[0] || args[0] > 1) {
    return `${args[0]} ${args[1]}s`
  }

  return `${args[0]} ${args[1]}`
}
