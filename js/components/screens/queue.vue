<template>
  <section id="queueWrapper">
    <screen-header>
      Current Queue
      <controls-toggler :showing-controls="showingControls" @toggleControls="toggleControls"/>

      <template v-slot:meta>
        <span v-if="meta.songCount">{{ meta.songCount | pluralize('song') }} • {{ meta.totalLength }}</span>
      </template>

      <template v-slot:controls>
        <song-list-controls
          v-if="state.songs.length && (!isPhone || showingControls)"
          @playAll="playAll"
          @playSelected="playSelected"
          @clearQueue="clearQueue"
          :songs="state.songs"
          :config="songListControlConfig"
          :selectedSongs="selectedSongs"
        />
      </template>
    </screen-header>

    <song-list v-show="state.songs.length" :items="state.songs" type="queue" ref="songList"/>

    <div v-show="!state.songs.length" class="none text-light-gray">
      <p>Empty spaces. Abandoned places.</p>

      <p v-if="shouldShowShufflingAllLink">How about
        <a class="start text-orange" @click.prevent="shuffleAll">shuffling all songs</a>?
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { pluralize } from '@/utils'
import { queueStore, songStore } from '@/stores'
import { playback } from '@/services'
import hasSongList from '@/mixins/has-song-list.ts'

export default mixins(hasSongList).extend({
  components: {
    ScreenHeader: () => import('@/components/ui/screen-header.vue')
  },

  filters: { pluralize },

  data: () => ({
    state: queueStore.state,
    songState: songStore.state,
    songListControlConfig: {
      clearQueue: true
    }
  }),

  computed: {
    shouldShowShufflingAllLink (): boolean {
      return this.songState.songs.length > 0
    }
  },

  methods: {
    getSongsToPlay (): Song[] {
      return this.state.songs.length ? (this.$refs.songList as any).getAllSongsWithSort() : songStore.all
    },

    shuffleAll: (): void => playback.queueAndPlay(songStore.all, true),
    clearQueue: (): void => queueStore.clear()
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#queueWrapper {
  .none {
    padding: 16px 24px;
  }

  button.play-shuffle {
    i {
      margin-right: 0 !important;
    }
  }
}
</style>
