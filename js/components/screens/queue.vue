<template>
  <section id="queueWrapper">
    <h1 class="heading">
      <span title="That's a lot of U's and E's">Current Queue
        <controls-toggler :showing-controls="showingControls" @toggleControls="toggleControls"/>

        <span class="meta" v-show="meta.songCount">
          {{ meta.songCount | pluralize('song') }}
          •
          {{ meta.totalLength }}
        </span>
      </span>

      <song-list-controls
        v-show="state.songs.length && (!isPhone || showingControls)"
        @playAll="playAll"
        @playSelected="playSelected"
        @clearQueue="clearQueue"
        :songs="state.songs"
        :config="songListControlConfig"
        :selectedSongs="selectedSongs"
      />
    </h1>

    <song-list v-show="state.songs.length" :items="state.songs" type="queue" ref="songList"/>

    <div v-show="!state.songs.length" class="none">
      <p>Empty spaces. Abandoned places.</p>

      <p v-if="shouldShowShufflingAllLink">How about
        <a class="start" @click.prevent="shuffleAll">shuffling all songs</a>?
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
      // @ts-ignore
      return this.state.songs.length ? this.$refs.songList.getAllSongsWithSort() : songStore.all
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
    color: $color2ndText;
    padding: 16px 24px;

    a {
      color: $colorHighlight;
    }
  }

  button.play-shuffle {
    i {
      margin-right: 0 !important;
    }
  }
}
</style>
