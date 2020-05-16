import Vue, { PropOptions } from 'vue'
import { secondsToHis } from '@/utils'

export default Vue.extend({
  props: {
    album: {
      type: Object,
      required: true
    } as PropOptions<Album>
  },

  computed: {
    length (): number {
      return this.album.songs.reduce((acc, song) => acc + song.length, 0)
    },

    fmtLength (): string {
      return secondsToHis(this.length)
    }
  }
})
