<template>
  <div id="app" :class="{ desktop: isDesktopApp }">
    <div id="main" v-if="authenticated">
      <hotkeys/>
      <event-listeners/>
      <app-header/>
      <main-wrapper/>
      <app-footer/>
      <support-koel/>
      <overlay ref="overlay"/>
    </div>

    <template v-else>
      <div class="login-wrapper" @dblclick.self="triggerMaximize">
        <login-form @loggedin="onUserLoggedIn"/>
      </div>
    </template>

    <song-context-menu :songs="contextMenuSongs" ref="songContextMenu"/>
    <album-context-menu :album="contextMenuAlbum" ref="albumContextMenu"/>
    <artist-context-menu :artist="contextMenuArtist" ref="artistContextMenu"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import AppHeader from '@/components/layout/app-header.vue'
import AppFooter from '@/components/layout/app-footer/index.vue'
import EventListeners from '@/components/utils/event-listeners.vue'
import Hotkeys from '@/components/utils/hotkeys.vue'
import LoginForm from '@/components/auth/login-form.vue'
import MainWrapper from '@/components/layout/main-wrapper/index.vue'
import Overlay from '@/components/ui/overlay.vue'

import { eventBus, showOverlay, hideOverlay, $, app as appUtils } from '@/utils'
import { events } from '@/config'
import { sharedStore, favoriteStore, queueStore, preferenceStore as preferences } from '@/stores'
import { playback, socket, auth } from '@/services'
import { clickaway, droppable, focus } from '@/directives'
import { BaseContextMenu } from 'koel/types/ui'

export default Vue.extend({
  components: {
    Hotkeys,
    AppHeader,
    AppFooter,
    MainWrapper,
    Overlay,
    LoginForm,
    EventListeners,
    SongContextMenu: () => import('@/components/song/context-menu.vue'),
    AlbumContextMenu: () => import('@/components/album/context-menu.vue'),
    ArtistContextMenu: () => import('@/components/artist/context-menu.vue'),
    SupportKoel: () => import('@/components/meta/support-koel.vue')
  },

  data: () => ({
    authenticated: false,
    isDesktopApp: KOEL_ENV === 'app',
    contextMenuSongs: [] as Song[],
    contextMenuAlbum: null as unknown as Album,
    contextMenuArtist: null as unknown as Artist
  }),

  async mounted (): Promise<void> {
    // The app has just been initialized, check if we can get the user data with an already existing token
    if (auth.hasToken()) {
      this.authenticated = true
      await this.init()
    }

    // Add an ugly mac/non-mac class for OS-targeting styles.
    // I'm crying inside.
    $.addClass(document.documentElement, navigator.userAgent.includes('Mac') ? 'mac' : 'non-mac')
  },

  created () {
    eventBus.on(events.SONG_CONTEXT_MENU_REQUESTED, async (e: MouseEvent, songs: Song[]) => {
      this.contextMenuSongs = ([] as Song[]).concat(songs)
      await this.$nextTick()
      ;(this.$refs.songContextMenu as BaseContextMenu).open(e.pageY, e.pageX)
    })

    eventBus.on(events.ALBUM_CONTEXT_MENU_REQUESTED, async (e: MouseEvent, album: Album) => {
      this.contextMenuAlbum = album
      await this.$nextTick()
      ;(this.$refs.albumContextMenu as BaseContextMenu).open(e.pageY, e.pageX)
    })

    eventBus.on(events.ARTIST_CONTEXT_MENU_REQUESTED, async (e: MouseEvent, artist: Artist) => {
      this.contextMenuArtist = artist
      await this.$nextTick()
      ;(this.$refs.artistContextMenu as BaseContextMenu).open(e.pageY, e.pageX)
    })
  },

  methods: {
    async init (): Promise<void> {
      showOverlay()
      await socket.init()

      // Make the most important HTTP request to get all necessary data from the server.
      // Afterwards, init all mandatory stores and services.
      try {
        await sharedStore.init()

        window.setTimeout(() => {
          playback.init()
          hideOverlay()

          this.requestNotificationPermission()

          window.addEventListener('beforeunload', (e: BeforeUnloadEvent): void => {
            if (!preferences.confirmClosing) {
              return
            }

            e.preventDefault()
            e.returnValue = ''
          })

          this.subscribeToBroadcastEvents()

          // Let all other components know we're ready.
          eventBus.emit(events.KOEL_READY)
        }, 100)
      } catch (err) {
        this.authenticated = false
        throw err
      }
    },

    /**
     * Request for notification permission if it's not provided and the user is OK with notifications.
     */
    requestNotificationPermission (): void {
      if (window.Notification && preferences.notify && window.Notification.permission !== 'granted') {
        window.Notification.requestPermission().then((result: string): void => {
          preferences.notify = result === 'denied'
        })
      }
    },

    onUserLoggedIn (): void {
      this.authenticated = true
      this.init()
    },

    subscribeToBroadcastEvents (): void {
      socket.listen(events.SOCKET_TOGGLE_FAVORITE, (): void => {
        if (queueStore.current) {
          favoriteStore.toggleOne(queueStore.current)
        }
      })
    },

    triggerMaximize: (): void => appUtils.triggerMaximize()
  }
})

// …and the global directives
Vue.directive('koel-focus', focus)
Vue.directive('koel-clickaway', clickaway)
Vue.directive('koel-droppable', droppable)
</script>

<style lang="scss">
@import "~#/app.scss";

#dragGhost {
  display: inline-block;
  background: var(--color-green);
  padding: .8rem;
  border-radius: .2rem;
  color: var(--color-text-primary);
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: var(--font-weight-light);
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;

  @media (hover: none) {
    display: none;
  }
}

#copyArea {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  bottom: 1px;

  @media (hover: none) {
    display: none;
  }
}

#main, .login-wrapper {
  display: flex;
  height: 100vh;
  flex-direction: column;
}

.login-wrapper {
  @include vertical-center();
  -webkit-app-region: drag;
  user-select: none;

  input, button {
    -webkit-app-region: no-drag;
  }

  padding-bottom: 0;
}
</style>
