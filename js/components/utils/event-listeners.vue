<script>
/**
 * Global event listeners (basically, those without a Vue instance access) go here.
 */
import isMobile from 'ismobilejs'
import router from '@/router'
import { ls } from '@/services'
import { playlistStore, preferenceStore, recentlyPlayedStore, userStore } from '@/stores'
import { alerts, event, forceReloadWindow } from '@/utils'

const deletePlaylist = playlist => {
  const destroy = async () => {
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
}

export default {
  render: h => null,

  created () {
    event.on({
      [event.$names.PLAYLIST_DELETE]: playlist => deletePlaylist(playlist),

      /**
       * Log the current user out and reset the application state.
       */
      async [event.$names.LOG_OUT] () {
        await userStore.logout()
        ls.remove('jwt-token')
        forceReloadWindow()
      },

      [event.$names.KOEL_READY]: () => router.init(),

      /**
       * Listen to 'main-content-view:load' event to load all recently played songs into the view
       */
      [event.$names.LOAD_MAIN_CONTENT]: async view => {
        if (view === 'recently-played') {
          recentlyPlayedStore.fetchAll()
        }
      },

      /**
       * Hide the panel away if a main view is triggered on mobile.
       */
      [event.$names.LOAD_MAIN_CONTENT]: () => (isMobile.phone && (preferenceStore.showExtraPanel = false))
    })
  }
}
</script>
