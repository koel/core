import { http } from '@/services'
import { alerts } from '@/utils'
import stub from '@/stubs/settings'

interface SettingStore {
  stub: Settings
  state: {
    settings: Settings
  }
  all: Settings

  init(settings: Settings): void
  update(): Promise<any>
}

export const settingStore: SettingStore = {
  stub,

  state: {
    settings: {}
  },

  init (settings) {
    this.state.settings = settings
  },

  get all () {
    return this.state.settings
  },

  update (): Promise<undefined> {
    return new Promise((resolve, reject): void => {
      http.post('settings', this.all, (): void => {
        alerts.success('Settings saved.')
        resolve()
      }, (error: any) => reject(error))
    })
  }
}
