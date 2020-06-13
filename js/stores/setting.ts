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

  async update (): Promise<void> {
    await http.post('settings', this.all)
    alerts.success('Settings saved.')
  }
}
