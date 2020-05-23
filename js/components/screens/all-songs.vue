<template>
  <section id="songsWrapper">
    <h1 class="heading">
      <span>All Songs
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

    <song-list :items="state.songs" type="all-songs" ref="songList"/>
  </section>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { pluralize } from '@/utils'
import { songStore } from '@/stores'
import hasSongList from '@/mixins/has-song-list.ts'

export default mixins(hasSongList).extend({
  filters: { pluralize },

  data: () => ({
    state: songStore.state
  }),

  methods: {
    getSongsToPlay (): Song[] {
      // @ts-ignore
      return this.$refs.songList.getAllSongsWithSort()
    }
  }
})
</script>
