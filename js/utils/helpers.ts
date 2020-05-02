export const use = (value: any, cb: Function): void => typeof value !== 'undefined' && value !== null && cb(value)
