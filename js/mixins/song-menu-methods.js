import { queueStore, playlistStore, favoriteStore } from '@/stores'

/**
 * Includes the methods triggerable on a song (context) menu.
 * Each component including this mixin must have a `songs` array as either data, prop, or computed.
 * Note that for some components, some of the methods here may not be applicable, or overridden,
 * for example close() and open().
 */
export default {
  methods: {
    queueSongsAfterCurrent () {
      queueStore.queueAfterCurrent(this.songs)
      this.close()
    },

    queueSongsToBottom () {
      queueStore.queue(this.songs)
      this.close()
    },

    queueSongsToTop () {
      queueStore.queueToTop(this.songs)
      this.close()
    },

    addSongsToFavorite () {
      favoriteStore.like(this.songs)
      this.close()
    },

    addSongsToExistingPlaylist (playlist) {
      playlistStore.addSongs(playlist, this.songs)
      this.close()
    }
  }
}
