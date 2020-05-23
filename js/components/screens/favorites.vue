<template>
  <section id="favoritesWrapper">
    <h1 class="heading">
      <span>Songs You Love
        <controls-toggler :showing-controls="showingControls" @toggleControls="toggleControls"/>

        <span class="meta" v-show="meta.songCount">
          {{ meta.songCount | pluralize('song') }}
          •
          {{ meta.totalLength }}
          <template v-if="sharedState.allowDownload && state.songs.length">
            •
            <a href @click.prevent="download" class="download" title="Download all songs in playlist" role="button">
              Download All
            </a>
          </template>
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

    <song-list v-show="state.songs.length" :items="state.songs" type="favorites" ref="songList"/>

    <div v-if="!state.songs.length" class="none">
      Start loving!
      Click the <i style="margin: 0 5px" class="fa fa-heart"></i> icon when a song is playing to add it
      to this list.
    </div>
  </section>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { pluralize } from '@/utils'
import { favoriteStore, sharedStore } from '@/stores'
import { download } from '@/services'
import hasSongList from '@/mixins/has-song-list.ts'

export default mixins(hasSongList).extend({
  filters: { pluralize },

  data: () => ({
    state: favoriteStore.state,
    sharedState: sharedStore.state
  }),

  methods: {
    getSongsToPlay (): Song[] {
      // @ts-ignore
      return this.$refs.songList.getAllSongsWithSort()
    },

    download: (): void => download.fromFavorites()
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#favoritesWrapper {
  .none {
    color: $color2ndText;
    padding: 16px 24px;

    a {
      color: $colorHighlight;
    }
  }
}
</style>
