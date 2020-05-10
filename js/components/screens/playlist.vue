<template>
  <section id="playlistWrapper">
    <template v-if="playlist.populated">
      <h1 class="heading">
        <span>{{ playlist.name }}
          <controls-toggler :showing-controls="showingControls" @toggleControls="toggleControls"/>

          <span class="meta" v-show="meta.songCount">
            {{ meta.songCount | pluralize('song') }}
            •
            {{ meta.totalLength }}
            <template v-if="sharedState.allowDownload && playlist.songs.length">
              •
              <a href @click.prevent="download" title="Download all songs in playlist" role="button">
                Download All
              </a>
            </template>
          </span>
        </span>

        <song-list-controls
          v-show="!isPhone || showingControls"
          @playAll="playAll"
          @playSelected="playSelected"
          @deletePlaylist="destroy"
          :songs = "playlist.songs"
          :config="songListControlConfig"
          :selectedSongs="selectedSongs"
        />
      </h1>

      <song-list v-show="playlist.songs.length"
        :items="playlist.songs"
        :playlist="playlist"
        type="playlist"
        ref="songList"
      />

      <div v-if="!playlist.songs.length" class="none">
        The playlist is currently empty. You can fill it up by dragging songs into its name in the sidebar,
        or use the &quot;Add To…&quot; button.
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { pluralize, event } from '@/utils'
import { playlistStore, sharedStore } from '@/stores'
import { download } from '@/services'
import hasSongList from '@/mixins/has-song-list.ts'

export default mixins(hasSongList).extend({
  filters: { pluralize },

  data: () => ({
    playlist: playlistStore.stub,
    sharedState: sharedStore.state,
    songListControlConfig: {
      deletePlaylist: true
    }
  }),

  created (): void {
    /**
     * Listen to 'main-content-view:load' event to load the requested
     * playlist into view if applicable.
     */
    event.on(event.$names.LOAD_MAIN_CONTENT, (view: MainViewName, playlist: Playlist): void => {
      if (view !== 'Playlist') {
        return
      }

      if (playlist.populated) {
        this.playlist = playlist
      } else {
        this.populate(playlist)
      }
    })
  },

  methods: {
    getSongs (): Song[] {
      return this.playlist.songs
    },

    destroy (): void {
      event.emit(event.$names.PLAYLIST_DELETE, this.playlist)
    },

    download (): void {
      return download.fromPlaylist(this.playlist)
    },

    /**
     * Fetch a playlist's content from the server, populate it, and use it afterwards.
     */
    async populate (playlist: Playlist): Promise<void> {
      await playlistStore.fetchSongs(playlist)
      this.playlist = playlist
      this.$nextTick(() => this.$refs.songList && (this.$refs.songList as any).sort())
    }
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#playlistWrapper {
  button.play-shuffle, button.del {
    i {
      margin-right: 0 !important;
    }
  }

  .none {
    color: $color2ndText;
    padding: 16px 24px;

    a {
      color: $colorHighlight;
    }
  }
}
</style>
