<template>
  <article class="artist-info" :class="mode">
    <h1 class="name">
      <span>{{ artist.name }}</span>
      <a
        :title="`Shuffle all songs by ${artist.name}`"
        @click.prevent="shuffleAll"
        class="shuffle"
        role="button"
      >
        <i class="fa fa-random"></i>
      </a>
    </h1>

    <main v-if="artist.info">
      <artist-thumbnail :entity="artist"/>

      <template v-if="artist.info">
        <div class="bio" v-if="artist.info.bio && artist.info.bio.summary">
          <div class="summary" v-show="showSummary" v-html="artist.info.bio.summary"></div>
          <div class="full" v-show="showFull" v-html="artist.info.bio.full"></div>

          <button class="more" v-show="showSummary" @click.prevent="showingFullBio = true">
            Full Bio
          </button>
        </div>
        <p class="none" v-else>This artist has no Last.fm biography – yet.</p>

        <footer>Data &copy; <a target="_blank" :href="artist.info.url">Last.fm</a></footer>
      </template>
    </main>
  </article>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { playback } from '@/services'

export default Vue.extend({
  props: {
    artist: Object as PropOptions<Artist>,

    mode: {
      type: String,
      default: 'sidebar',
      validator: value => ['sidebar', 'full'].includes(value)
    }
  },

  components: {
    ArtistThumbnail: () => import('@/components/ui/album-artist-thumbnail.vue')
  },

  data: () => ({
    showingFullBio: false
  }),

  watch: {
    /**
     * Whenever a new artist is loaded into this component, we reset the "full bio" state.
     */
    artist (): void {
      this.showingFullBio = false
    }
  },

  computed: {
    showSummary (): boolean {
      return this.mode !== 'full' && !this.showingFullBio
    },

    showFull (): boolean {
      return this.mode === 'full' || this.showingFullBio
    }
  },

  methods: {
    shuffleAll (): void {
      playback.playAllByArtist(this.artist, false)
    }
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.artist-info {
  @include artist-album-info();
}
</style>
