<script lang="ts">
/**
 * Global event listeners (basically, those without a Vue instance access) go here.
 */
import Vue, { VNode } from 'vue'
import isMobile from 'ismobilejs'
import router from '@/router'
import { ls } from '@/services'
import { playlistStore, preferenceStore, userStore } from '@/stores'
import { alerts, event, forceReloadWindow } from '@/utils'

export default Vue.extend({
  render: (h: Function): VNode => h(),
  created () {
    event.on({
      [event.$names.PLAYLIST_DELETE]: (playlist: Playlist): void => {
        const destroy = async (): Promise<void> => {
          await playlistStore.delete(playlist)
          alerts.success(`Deleted playlist &quot;${playlist.name}&quot;.`)
          router.go('home')
        }

        if (!playlist.songs.length) {
          destroy()
          return
        } else {
          alerts.confirm(`Delete the playlist &quot;${playlist.name}&quot?`, destroy)
        }
      },

      /**
       * Log the current user out and reset the application state.
       */
      [event.$names.LOG_OUT]: async (): Promise<void> => {
        await userStore.logout()
        ls.remove('jwt-token')
        forceReloadWindow()
      },

      [event.$names.KOEL_READY]: (): void => router.init(),

      /**
       * Hide the panel away if a main view is triggered on mobile.
       */
      [event.$names.LOAD_MAIN_CONTENT]: (): void => {
        if (isMobile.phone) {
          preferenceStore.showExtraPanel = false
        }
      }
    })
  }
})
</script>
