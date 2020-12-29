<script lang="ts">
/**
 * Global event listeners (basically, those without a Vue instance access) go here.
 */
import Vue, { VNode } from 'vue'
import isMobile from 'ismobilejs'
import router from '@/router'
import { auth } from '@/services'
import { playlistStore, preferenceStore, userStore } from '@/stores'
import { alerts, eventBus, forceReloadWindow } from '@/utils'
import { events } from '@/config'

export default Vue.extend({
  render: (h: Function): VNode => h(),
  created (): void {
    eventBus.on({
      [events.PLAYLIST_DELETE]: (playlist: Playlist): void => {
        const destroy = async (): Promise<void> => {
          await playlistStore.delete(playlist)
          alerts.success(`Deleted playlist &quot;${playlist.name}&quot;.`)
          router.go('home')
        }

        if (!playlist.songs.length) {
          destroy()
        } else {
          alerts.confirm(`Delete the playlist &quot;${playlist.name}&quot?`, destroy)
        }
      },

      /**
       * Log the current user out and reset the application state.
       */
      [events.LOG_OUT]: async (): Promise<void> => {
        await userStore.logout()
        auth.destroy()
        forceReloadWindow()
      },

      [events.KOEL_READY]: (): void => router.init(),

      /**
       * Hide the panel away if a main view is triggered on mobile.
       */
      [events.LOAD_MAIN_CONTENT]: (): void => {
        if (isMobile.phone) {
          preferenceStore.showExtraPanel = false
        }
      }
    })
  }
})
</script>
