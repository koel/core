import Vue, { PropOptions } from 'vue'
import { queueStore, playlistStore, favoriteStore } from '@/stores'

/**
 * Includes the methods triggerable on a song (context) menu.
 * Each component including this mixin must have a `songs` array as either data, prop, or computed.
 * Note that for some components, some of the methods here may not be applicable, or overridden,
 * for example close() and open().
 */
export default Vue.extend({
  props: {
    songs: {
      type: Array,
      required: true
    } as PropOptions<Song[]>
  },

  methods: {
    queueSongsAfterCurrent (): void {
      queueStore.queueAfterCurrent(this.songs)
      this.close()
    },

    queueSongsToBottom (): void {
      queueStore.queue(this.songs)
      this.close()
    },

    queueSongsToTop (): void {
      queueStore.queueToTop(this.songs)
      this.close()
    },

    addSongsToFavorite (): void {
      favoriteStore.like(this.songs)
      this.close()
    },

    addSongsToExistingPlaylist (playlist: Playlist): void {
      playlistStore.addSongs(playlist, this.songs)
      this.close()
    },

    close: (): void => {
      throw new Error('Unimplemented method.')
    }
  }
})
