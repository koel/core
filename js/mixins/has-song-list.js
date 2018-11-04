/**
 * Add necessary functionalities into a view that contains a song-list component.
 */

import { assignIn } from 'lodash'
import isMobile from 'ismobilejs'

import { playback } from '@/services'
import { event } from '@/utils'

export default {
  components: {
    SongList: () => import('@/components/song/list.vue'),
    SongListControls: () => import('@/components/song/list-controls.vue'),
    ControlsToggler: () => import('@/components/song/list-controls-toggler.vue')
  },

  data () {
    return {
      state: null,
      meta: {
        songCount: 0,
        totalLength: '00:00'
      },
      selectedSongs: [],
      showingControls: false,
      songListControlConfig: {},
      isPhone: isMobile.phone
    }
  },

  methods: {
    shuffleAll () {
      playback.queueAndPlay(this.state.songs, true /* shuffled */)
    },

    shuffleSelected () {
      playback.queueAndPlay(this.selectedSongs, true /* shuffled */)
    },

    toggleControls () {
      this.showingControls = !this.showingControls
    }
  },

  created () {
    event.on({
      [event.$names.UPDATE_META]: (meta, target) => target === this && assignIn(this.meta, meta),
      [event.$names.SET_SELECTED_SONGS]: (songs, target) => target === this && (this.selectedSongs = songs)
    })
  }
}
