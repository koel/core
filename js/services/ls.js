import localStorage from 'local-storage'

export const ls = {
  get: (key, defaultVal = null) => localStorage(key) || defaultVal,
  set: (key, val) => localStorage(key, val),
  remove: key => localStorage.remove(key)
}
