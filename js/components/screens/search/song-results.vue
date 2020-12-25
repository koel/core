<template>
  <section id="songResultsWrapper">
    <h1 class="heading">
      <span>
        Showing Songs for <strong>{{ decodedQ }}</strong>
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
        :songs="state.songs"
        :config="songListControlConfig"
        :selectedSongs="selectedSongs"
      />
    </h1>

    <song-list :items="state.songs" type="search-results" ref="songList"/>
  </section>
</template>

<script lang="ts">
import { searchStore } from '@/stores'
import mixins from 'vue-typed-mixins'
import hasSongList from '@/mixins/has-song-list'
import { pluralize } from '@/utils'

export default mixins(hasSongList).extend({
  filters: { pluralize },

  props: {
    q: {
      type: String,
      required: true
    }
  },

  data: () => ({
    state: searchStore.state
  }),

  computed: {
    decodedQ (): string {
      return decodeURIComponent(this.q)
    }
  },

  created () {
    searchStore.resetSongResultState()
    searchStore.songSearch(this.decodedQ)
  }
})
</script>
