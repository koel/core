import localStorage from 'local-storage'

interface Ls {
  get: (key: string, defaultValue?: any) => any
  set: (key: string, value: any) => void
  remove: (key: string) => void
}

export const ls: Ls = {
  get: (key: string, defaultValue: any = null) => {
    const value = localStorage.get(key)

    return value === null ? defaultValue : value
  },

  set: (key: string, value: any) => localStorage.set(key, value),

  remove: (key: string) => localStorage.remove(key)
}
