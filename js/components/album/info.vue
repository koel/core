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

    <main v-if="album.info">
      <img v-if="album.info.image" :src="album.info.image" class="cover" alt="Album's cover">

      <div class="wiki" v-if="album.info.wiki && album.info.wiki.summary">
        <div class="summary" v-show="showSummary" v-html="album.info.wiki.summary"></div>
        <div class="full" v-show="showFull" v-html="album.info.wiki.full"></div>

        <button class="more" v-if="showSummary" @click.prevent="showingFullWiki = true">
          Full Wiki
        </button>
      </div>

      <track-list :album="album" v-if="album.info.tracks.length"/>

      <footer>Data &copy; <a target="_blank" :href="album.info.url">Last.fm</a></footer>
    </main>

    <p class="none" v-else>No album information found.</p>
  </article>
</template>

<script>
import { sharedStore } from '@/stores'
import { playback, ls } from '@/services'

export default {
  props: {
    album: Object,
    mode: {
      type: String,
      default: 'sidebar',
      validator: value => ['sidebar', 'full'].includes(value)
    }
  },

  components: {
    TrackList: () => import('./track-list.vue')
  },

  data: () => ({
    showingFullWiki: false,
    useiTunes: sharedStore.state.useiTunes
  }),

  watch: {
    /**
     * Whenever a new album is loaded into this component, we reset the "full wiki" state.
     */
    album () {
      this.showingFullWiki = false
    }
  },

  computed: {
    showSummary () {
      return this.mode !== 'full' && !this.showingFullWiki
    },

    showFull () {
      return this.mode === 'full' || this.showingFullWiki
    },

    iTunesUrl () {
      return `${window.BASE_URL}api/itunes/album/${this.album.id}&jwt-token=${ls.get('jwt-token')}`
    }
  },

  methods: {
    shuffleAll () {
      playback.playAllInAlbum(this.album)
    }
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.album-info {
  @include artist-album-info();
}
</style>
