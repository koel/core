import localStorage from 'local-storage'

export const ls = {
  get: (key, defaultValue = null) => {
    const value = localStorage.get(key)

    return value === null ? defaultValue : value
  },
  set: (key, value) => localStorage.set(key, value),
  remove: key => localStorage.remove(key)
}
