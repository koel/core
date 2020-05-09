import isMobile from 'ismobilejs'

import { loadMainView } from './utils'
import { artistStore, albumStore, songStore, queueStore, playlistStore, userStore } from './stores'
import { playback } from './services'
import { MainView } from '@/config'
import { use } from '@/utils'

interface Routes {
  [path: string]: Function
}

interface Router {
  routes: Routes

  init(): void
  loadState(): void
  go(path: string | number): void
}

const router: Router = {
  routes: {
    '/home': (): void => loadMainView(MainView.Home),
    '/queue': (): void => loadMainView(MainView.Queue),
    '/songs': (): void => loadMainView(MainView.Songs),
    '/albums': (): void => loadMainView(MainView.Albums),
    '/artists': (): void => loadMainView(MainView.Artists),
    '/favorites': (): void => loadMainView(MainView.Favorites),
    '/recently-played': (): void => loadMainView(MainView.RecentlyPlayed),

    '/settings': (): void => {
      if (userStore.current.is_admin) {
        loadMainView(MainView.Settings)
      }
    },

    '/users': (): void => {
      if (userStore.current.is_admin) {
        loadMainView(MainView.Users)
      }
    },

    '/youtube': (): void => loadMainView(MainView.YouTube),
    '/visualizer': (): void => loadMainView(MainView.Visualizer),
    '/profile': (): void => loadMainView(MainView.Profile),

    '/album/(\\d+)': (id: number) => use(albumStore.byId(~~id), (album: Album): void => {
      loadMainView(MainView.Album, album)
    }),

    '/artist/(\\d+)': (id: number) => use(artistStore.byId(~~id), (artist: Artist): void => {
      loadMainView(MainView.Artist, artist)
    }),

    '/playlist/(\\d+)': (id: number) => use(playlistStore.byId(~~id), (playlist: Playlist): void => {
      loadMainView(MainView.Playlist, playlist)
    }),

    '/song/([a-z0-9]{32})': (id: string): void => use(songStore.byId(id), (song: Song): void => {
      if (isMobile.apple.device) {
        // Mobile Safari doesn't allow autoplay, so we just queue.
        queueStore.queue(song)
        loadMainView(MainView.Queue)
      } else {
        playback.queueAndPlay([song])
      }
    })
  },

  init (): void {
    this.loadState()
    window.addEventListener('popstate', (): void => this.loadState(), true)
  },

  loadState (): void {
    if (!window.location.hash) {
      return this.go('home')
    }

    Object.keys(this.routes).forEach((route: string): void => {
      const matches = window.location.hash.match(new RegExp(`^#!${route}$`))

      if (matches) {
        const [, ...params] = matches
        this.routes[route](...params)
      }
    })
  },

  /**
   * Navigate to a (relative, hash-bang'ed) path.
   */
  go: (path: string | number): void => {
    if (window.__UNIT_TESTING__) {
      return
    }

    if (typeof path === 'number') {
      window.history.go(path)
      return
    }

    if (path[0] !== '/') {
      path = `/${path}`
    }

    if (path.indexOf('/#!') !== 0) {
      path = `/#!${path}`
    }

    path = path.substring(1, path.length)
    document.location.href = `${document.location.origin}${document.location.pathname}${path}`
  }
}

export default router
