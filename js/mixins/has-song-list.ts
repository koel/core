/**
 * Add necessary functionalities into a view that contains a song-list component.
 */

import Vue from 'vue'
import isMobile from 'ismobilejs'

import { playback } from '@/services'
import { eventBus } from '@/utils'
import { events } from '@/config'

import ControlsToggler from '@/components/ui/screen-controls-toggler.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'

export default Vue.extend({
  components: {
    SongList,
    SongListControls,
    ControlsToggler
  },

  data: () => ({
    state: null as unknown as SongListState,
    meta: {
      songCount: 0,
      totalLength: '00:00'
    } as SongListMeta,
    selectedSongs: [] as Song[],
    showingControls: false,
    songListControlConfig: {} as Partial<SongListControlsConfig>,
    isPhone: isMobile.phone
  }),

  methods: {
    playAll (shuffled: boolean): void {
      playback.queueAndPlay(this.getSongsToPlay(), shuffled)
    },

    playSelected (shuffled: boolean): void {
      playback.queueAndPlay(this.selectedSongs, shuffled)
    },

    toggleControls (): void {
      this.showingControls = !this.showingControls
    },

    getSongsToPlay (): Song[] {
      return (this.$refs.songList as any).getAllSongsWithSort()
    }
  },

  created (): void {
    eventBus.on({
      [events.UPDATE_META]: (meta: SongListMeta, target: Vue): void => {
        if (target === this) {
          Object.assign(this.meta, meta)
        }
      },

      [events.SET_SELECTED_SONGS]: (songs: Song[], target: Vue): void => {
        if (target === this) {
          this.selectedSongs = songs
        }
      }
    })
  }
})
