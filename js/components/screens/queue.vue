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
        @shuffleAll="shuffleAll"
        @shuffleSelected="shuffleSelected"
        @clearQueue="clearQueue"
        :config="songListControlConfig"
        :selectedSongs="selectedSongs"
      />
    </h1>

    <song-list v-show="state.songs.length" :items="state.songs" type="queue"/>

    <div v-show="!state.songs.length" class="none">
      <p>Empty spaces. Abandoned places.</p>

      <p v-if="shouldShowShufflingAllLink">How about
        <a class="start" @click.prevent="shuffleAll">shuffling all songs</a>?
      </p>
    </div>
  </section>
</template>

<script>
import { pluralize } from '@/utils'
import { queueStore, songStore } from '@/stores'
import { playback } from '@/services'
import hasSongList from '@/mixins/has-song-list'

export default {
  mixins: [hasSongList],
  filters: { pluralize },

  data () {
    return {
      state: queueStore.state,
      songListControlConfig: {
        clearQueue: true
      }
    }
  },

  computed: {
    shouldShowShufflingAllLink: () => songStore.all.length > 0
  },

  methods: {
    /**
     * Shuffle all songs we have.
     * Overriding the mixin.
     */
    shuffleAll () {
      playback.queueAndPlay(
        this.state.songs.length ? this.state.songs : songStore.all,
        true /* shuffled */
      )
    },

    clearQueue: () => queueStore.clear()
  }
}
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
