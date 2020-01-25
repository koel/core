/**
 * Add necessary functionalities into a view that contains a song-list component.
 */

import { assignIn } from 'lodash'
import isMobile from 'ismobilejs'

import { playback } from '@/services'
import { event } from '@/utils'

export default {
  components: {
    SongList: () => import('@/components/song/list'),
    SongListControls: () => import('@/components/song/list-controls'),
    ControlsToggler: () => import('@/components/song/list-controls-toggler')
  },

  data: () => ({
    state: null,
    meta: {
      songCount: 0,
      totalLength: '00:00'
    },
    selectedSongs: [],
    showingControls: false,
    songListControlConfig: {},
    isPhone: isMobile.phone
  }),

  methods: {
    playAll (shuffled) {
      if (this.state) {
        playback.queueAndPlay(this.state.songs, shuffled)
      } else if (typeof this.getSongs === 'function') {
        playback.queueAndPlay(this.getSongs(), shuffled)
      } else {
        throw Error('Either this.state.songs or this.getSongs() should be defined and resolve into an array of songs')
      }
    },

    playSelected (shuffled) {
      playback.queueAndPlay(this.selectedSongs, shuffled)
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
