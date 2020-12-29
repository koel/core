<template>
  <article class="album-info" :class="mode">
    <h1 class="name">
      <span>{{ album.name }}</span>
      <a
        :title="`Shuffle all songs in ${album.name}`"
        @click.prevent="shuffleAll"
        class="shuffle"
        role="button"
      >
        <i class="fa fa-random"></i>
      </a>
    </h1>

    <main>
      <album-thumbnail :entity="album"/>

      <template v-if="album.info">
        <div class="wiki" v-if="album.info.wiki && album.info.wiki.summary">
          <div class="summary" v-show="showSummary" v-html="album.info.wiki.summary"></div>
          <div class="full" v-show="showFull" v-html="album.info.wiki.full"></div>

          <button class="more" v-if="showSummary" @click.prevent="showingFullWiki = true">
            Full Wiki
          </button>
        </div>

        <track-list :album="album" v-if="album.info.tracks && album.info.tracks.length"/>

        <footer>Data &copy; <a target="_blank" :href="album.info.url">Last.fm</a></footer>
      </template>
    </main>

  </article>
</template>

<script lang="ts">
import { sharedStore } from '@/stores'
import { playback, auth } from '@/services'
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    album: Object as PropOptions<Album>,
    mode: {
      type: String,
      default: 'sidebar',
      validator: value => ['sidebar', 'full'].includes(value)
    }
  },

  components: {
    TrackList: () => import('./track-list.vue'),
    AlbumThumbnail: () => import('@/components/ui/album-artist-thumbnail.vue')
  },

  data: () => ({
    showingFullWiki: false,
    useiTunes: sharedStore.state.useiTunes
  }),

  watch: {
    /**
     * Whenever a new album is loaded into this component, we reset the "full wiki" state.
     */
    album (): void {
      this.showingFullWiki = false
    }
  },

  computed: {
    showSummary (): boolean {
      return this.mode !== 'full' && !this.showingFullWiki
    },

    showFull (): boolean {
      return this.mode === 'full' || this.showingFullWiki
    },

    iTunesUrl (): string {
      return `${window.BASE_URL}itunes/album/${this.album.id}&api_token=${auth.getToken()}`
    }
  },

  methods: {
    shuffleAll (): void {
      playback.playAllInAlbum(this.album)
    }
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.album-info {
  @include artist-album-info();
}
</style>
