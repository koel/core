/**
 * Add necessary functionalities into a view that contains a song-list component.
 */

import Vue from 'vue'
import isMobile from 'ismobilejs'

import { playback } from '@/services'
import { event } from '@/utils'

export default Vue.extend({
  components: {
    SongList: () => import('@/components/song/list.vue'),
    SongListControls: () => import('@/components/song/list-controls.vue'),
    ControlsToggler: () => import('@/components/song/list-controls-toggler.vue')
  },

  data: () => ({
    state: {} as SongListState,
    meta: {
      songCount: 0,
      totalLength: '00:00'
    } as SongListMeta,
    selectedSongs: [] as Song[],
    showingControls: false,
    songListControlConfig: {},
    isPhone: isMobile.phone
  }),

  methods: {
    playAll (shuffled: boolean): void {
      if (this.state) {
        playback.queueAndPlay(this.state.songs, shuffled)
      } else {
        playback.queueAndPlay(this.getSongs(), shuffled)
      }
    },

    playSelected (shuffled: boolean): void {
      playback.queueAndPlay(this.selectedSongs, shuffled)
    },

    toggleControls (): void {
      this.showingControls = !this.showingControls
    },

    getSongs: (): Song[] => {
      throw new Error('Method not implemented')
    }
  },

  created (): void {
    event.on({
      [event.$names.UPDATE_META]: (meta: SongListMeta, target: Vue): void => {
        if (target === this) {
          Object.assign(this.meta, meta)
        }
      },

      [event.$names.SET_SELECTED_SONGS]: (songs: Song[], target: Vue): void => {
        if (target === this) {
          this.selectedSongs = songs
        }
      }
    })
  }
})
