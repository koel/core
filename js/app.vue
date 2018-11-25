<template>
  <div id="app" :class="{ desktop: isDesktopApp }">
    <div id="main" tabindex="0" v-if="authenticated">
      <hotkeys/>
      <app-header/>
      <main-wrapper/>
      <app-footer/>
      <overlay ref="overlay"/>
    </div>

    <template v-else>
      <div class="login-wrapper" @dblclick.self="triggerMaximize">
        <login-form @loggedin="onUserLoggedIn"/>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'

import AppHeader from '@/components/layout/app-header.vue'
import AppFooter from '@/components/layout/app-footer.vue'
import MainWrapper from '@/components/layout/main-wrapper/index.vue'
import Overlay from '@/components/ui/overlay.vue'
import LoginForm from '@/components/auth/login-form.vue'
import Hotkeys from '@/components/utils/hotkeys.vue'

import { event, showOverlay, hideOverlay, forceReloadWindow, $, app as appUtils } from '@/utils'
import { sharedStore, userStore, favoriteStore, queueStore, preferenceStore as preferences } from '@/stores'
import { playback, ls, socket, http } from '@/services'
import { focusDirective, clickawayDirective } from '@/directives'
import router from '@/router'

export default {
  components: {
    Hotkeys,
    AppHeader,
    AppFooter,
    MainWrapper,
    Overlay,
    LoginForm
  },

  data () {
    return {
      authenticated: false,
      isDesktopApp: KOEL_ENV === 'app'
    }
  },

  mounted () {
    // The app has just been initialized, check if we can get the user data with an already existing token
    const token = ls.get('jwt-token')
    if (token) {
      this.authenticated = true
      this.init()
    }

    // Create the element to be the ghost drag image.
    const dragGhost = document.createElement('div')
    dragGhost.id = 'dragGhost'
    document.body.appendChild(dragGhost)

    // And the textarea to copy stuff
    const copyArea = document.createElement('textarea')
    copyArea.id = 'copyArea'
    document.body.appendChild(copyArea)

    // Add an ugly mac/non-mac class for OS-targeting styles.
    // I'm crying inside.
    $.addClass(document.documentElement, navigator.userAgent.includes('Mac') ? 'mac' : 'non-mac')
  },

  methods: {
    async init () {
      showOverlay()
      await socket.init()

      // Make the most important HTTP request to get all necessary data from the server.
      // Afterwards, init all mandatory stores and services.
      try {
        await sharedStore.init()
        playback.init()
        hideOverlay()

        this.requestNotifPermission()

        // To confirm or not to confirm closing, it's a question.
        window.onbeforeunload = e => {
          if (!preferences.confirmClosing) {
            return
          }

          // Notice that a custom message like this has ceased to be supported
          // starting from Chrome 51.
          return 'You asked Koel to confirm before closing, so here it is.'
        }

        // Ping the server everytime the window is focused, so that we don't have those
        // "suddent" logout.
        window.addEventListener('focus', () => http.get('/ping'))

        this.subscribeToBroadcastedEvents()

        // Let all other components know we're ready.
        event.emit(event.$names.KOEL_READY)
      } catch (err) {
        this.authenticated = false
      }
    },

    /**
     * Request for notification permission if it's not provided and the user is OK with notifs.
     */
    requestNotifPermission () {
      if (window.Notification && preferences.notify && window.Notification.permission !== 'granted') {
        window.Notification.requestPermission(result => (result === 'denied' && (preferences.notify = false)))
      }
    },

    /**
     * When the user logs in, set the whole app to be "authenticated" and initialize it.
     */
    onUserLoggedIn () {
      this.authenticated = true
      this.init()
    },

    /**
     * Subscribes to the events broadcasted e.g. from the remote controller.
     */
    subscribeToBroadcastedEvents () {
      socket.listen(event.$names.SOCKET_TOGGLE_FAVORITE, () => {
        queueStore.current && favoriteStore.toggleOne(queueStore.current)
      })
    },

    triggerMaximize: () => appUtils.triggerMaximize()
  },

  created () {
    event.on({
      /**
       * Log the current user out and reset the application state.
       */
      async [event.$names.LOG_OUT] () {
        await userStore.logout()
        ls.remove('jwt-token')
        forceReloadWindow()
      },

      [event.$names.KOEL_READY]: () => router.init()
    })
  }
}

// …and the global directives
Vue.directive('koel-focus', focusDirective)
Vue.directive('koel-clickaway', clickawayDirective)
</script>

<style lang="scss">
@import "~#/app.scss";

#dragGhost {
  position: absolute;
  display: inline-block;
  background: $colorGreen;
  padding: .8rem;
  border-radius: .2rem;
  color: #fff;
  font-family: $fontFamily;
  font-size: 1rem;
  font-weight: $fontWeight_Thin;
  top: -100px;
  left: 0px;

  /**
   * We can totally hide this element on touch devices, because there's
   * no drag and drop support there anyway.
   */
  html.touchevents & {
    display: none;
  }
}

#copyArea {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  bottom: 1px;

  html.touchevents & {
    display: none;
  }
}

#main, .login-wrapper {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding-bottom: $footerHeight;
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
