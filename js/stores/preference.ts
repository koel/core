import { userStore } from '.'
import { ls } from '@/services'

interface PreferenceStore {
  storeKey: string
  state: { [key: string]: any }

  init(user?: User | null): void
  setupProxy(): void
  get(key: string): any
  set(key: string, value: any): void
  save(): void
}

export const preferenceStore: PreferenceStore = {
  storeKey: '',

  state: {
    volume: 7,
    notify: true,
    repeatMode: 'NO_REPEAT',
    showExtraPanel: true,
    confirmClosing: false,
    equalizer: {
      preamp: 0,
      gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    artistsViewMode: null,
    albumsViewMode: null,
    selectedPreset: -1,
    transcodeOnMobile: false,
    supportBarNoBugging: false,
    showAlbumArtOverlay: true
  },

  init (user: User | null = null): void {
    user = user || userStore.current
    this.storeKey = `preferences_${user!.id}`
    this.state = Object.assign(this.state, ls.get(this.storeKey, this.state))
    this.setupProxy()
  },

  /**
   * Proxy the state properties, so that each can be directly accessed using the key.
   */
  setupProxy (): void {
    Object.keys(this.state).forEach(key => {
      Object.defineProperty(this, key, {
        get: () => this.get(key),
        set: value => this.set(key, value),
        configurable: true
      })
    })
  },

  set (key: string, val: any): void {
    this.state[key] = val
    this.save()
  },

  get (key: string): any {
    return this.state.hasOwnProperty(key) ? this.state[key] : null
  },

  save (): void {
    ls.set(this.storeKey, this.state)
  }
}
