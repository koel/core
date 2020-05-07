import Vue, { PropOptions } from 'vue'
import { getDefaultCover, secondsToHis } from '@/utils'

export default Vue.extend({
  props: {
    artist: {
      type: Object,
      required: true
    } as PropOptions<Artist>
  },

  computed: {
    length (): number {
      return this.artist.songs.reduce((acc, song) => acc + song.length, 0)
    },

    fmtLength (): string {
      return secondsToHis(this.length)
    },

    image (): string {
      if (!this.artist.image) {
        this.artist.image = getDefaultCover()

        this.artist.albums.every(album => {
          // If there's a "real" cover, use it.
          if (album.cover !== getDefaultCover()) {
            this.artist.image = album.cover
            // I want to break free.
            return false
          }
        })
      }

      return this.artist.image
    }
  }
})
