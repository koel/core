import localStorage from 'local-storage'

export const ls = {
  get: (key: string, defaultValue: any = null): any => {
    const value = localStorage.get(key)

    return value === null ? defaultValue : value
  },

  set: (key: string, value: any): void => {
    localStorage.set(key, value)
  },

  remove: (key: string): void => {
    localStorage.remove(key)
  }
}
