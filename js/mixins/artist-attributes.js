import { getDefaultCover, secondsToHis } from '@/utils'

export default {
  computed: {
    length () {
      return this.artist.songs.reduce((acc, song) => acc + song.length, 0)
    },

    fmtLength () {
      return secondsToHis(this.length)
    },

    image () {
      if (!this.artist.image) {
        this.artist.image = getDefaultCover()

        this.artist.albums.every(album => {
          // If there's a "real" cover, use it.
          if (album.image !== getDefaultCover()) {
            this.artist.image = album.cover
            // I want to break free.
            return false
          }
        })
      }

      return this.artist.image
    }
  }
}
