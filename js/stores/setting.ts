import { http } from '@/services'
import { alerts } from '@/utils'
import stub from '@/stubs/settings'

export const settingStore = {
  stub,

  state: {
    settings: []
  },

  init (settings) {
    this.state.settings = settings
  },

  get all () {
    return this.state.settings
  },

  update (): Promise<any> {
    return new Promise((resolve, reject): void => {
      http.post('settings', this.all, ({ data } : { data: any }) => {
        alerts.success('Settings saved.')
        resolve(data)
      }, (error: any) => reject(error))
    })
  }
}
