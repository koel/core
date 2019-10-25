export const use = (value, cb) => typeof value !== 'undefined' && value !== null && cb(value)
