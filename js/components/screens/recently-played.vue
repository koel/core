<template>
  <section id="recentlyPlayedWrapper">
    <h1 class="heading">
      <span>Recently Played
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

    <song-list v-show="state.songs.length" :items="state.songs" type="recently-played" :sortable="false"/>

    <div v-if="!state.songs.length" class="none">
      This playlist will be automatically filled with the songs you most recently played, so start playing!
    </div>
  </section>
</template>

<script lang="ts">
import { eventBus, pluralize } from '@/utils'
import { events } from '@/config'
import { recentlyPlayedStore } from '@/stores'
import hasSongList from '@/mixins/has-song-list.ts'
import mixins from 'vue-typed-mixins'

export default mixins(hasSongList).extend({
  filters: { pluralize },

  data: () => ({
    state: recentlyPlayedStore.state
  }),

  methods: {
    getSongsToPlay (): Song[] {
      return this.state.songs
    }
  },

  created (): void {
    eventBus.on({
      [events.LOAD_MAIN_CONTENT]: (view: MainViewName): void => {
        if (view === 'RecentlyPlayed') {
          recentlyPlayedStore.fetchAll()
        }
      }
    })
  }
})
</script>

<style lang="scss">
  @import "~#/partials/_vars.scss";

  #recentlyPlayedWrapper {
    .none {
      color: $color2ndText;
      padding: 16px 24px;

      a {
        color: $colorHighlight;
      }
    }
  }
</style>
