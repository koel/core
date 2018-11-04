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
        @shuffleAll="shuffleAll"
        @shuffleSelected="shuffleSelected"
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

<script>
  import { event, pluralize } from '@/utils'
  import { recentlyPlayedStore } from '@/stores'
  import hasSongList from '@/mixins/has-song-list'

  export default {
    mixins: [hasSongList],
    filters: { pluralize },

    data: () => ({
      state: recentlyPlayedStore.state
    }),

    created () {
      /**
       * Listen to 'main-content-view:load' event to load all recently played songs into the view
       */
      event.on(event.$names.LOAD_MAIN_CONTENT, async view => {
        if (view === 'recently-played') {
          await recentlyPlayedStore.fetchAll()
        }
      })
    }
  }
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
