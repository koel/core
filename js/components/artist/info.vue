<template>
  <article class="artist-info" :class="mode">
    <h1 class="name">
      <span>{{ artist.name }}</span>
      <a class="shuffle" @click.prevent="shuffleAll"><i class="fa fa-random"></i></a>
    </h1>

    <div v-if="artist.info">
      <img v-if="artist.info.image" :src="artist.info.image"
        title="They see me posin, they hatin"
        class="cool-guys-posing cover">

      <div class="bio" v-if="artist.info.bio.summary">
        <div class="summary" v-show="showSummary" v-html="artist.info.bio.summary"></div>
        <div class="full" v-show="showFull" v-html="artist.info.bio.full"></div>

        <button class="more" v-show="showSummary" @click.prevent="showingFullBio = true">
          Full Bio
        </button>
      </div>
      <p class="none" v-else>This artist has no Last.fm biography – yet.</p>

      <footer>Data &copy; <a target="_blank" :href="artist.info.url">Last.fm</a></footer>
    </div>

    <p class="none" v-else>Nothing can be found. This artist is a mystery.</p>
  </article>
</template>

<script>
import { playback } from '@/services'

export default {
  props: {
    artist: Object,
    mode: {
      type: String,
      default: 'sidebar',
      validator: value => ['sidebar', 'full'].includes(value)
    }
  },

  data () {
    return {
      showingFullBio: false
    }
  },

  watch: {
    /**
     * Whenever a new artist is loaded into this component, we reset the "full bio" state.
     */
    artist () {
      this.showingFullBio = false
    }
  },

  computed: {
    showSummary () {
      return this.mode !== 'full' && !this.showingFullBio
    },

    showFull () {
      return this.mode === 'full' || this.showingFullBio
    }
  },

  methods: {
    shuffleAll () {
      playback.playAllByArtist(this.artist, false)
    }
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.artist-info {
  @include artist-album-info();
}
</style>
