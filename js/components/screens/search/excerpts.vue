<template>
  <section id="searchExcerptsWrapper">
    <screen-header>
      <span v-if="q">Search Results for <strong>{{ q }}</strong></span>
      <span v-else>Search</span>
    </screen-header>

    <div class="main-scroll-wrap" ref="wrapper">
      <div class="results" v-if="q">
        <section class="songs" data-testid="song-excerpts">
          <h1>
            Songs
            <btn
              v-if="searchState.excerpt.songs.length"
              @click.prevent="goToSongResults"
              rounded
              small
              orange
              data-test="view-all-songs-btn"
            >
              View All
            </btn>
          </h1>
          <ul v-if="searchState.excerpt.songs.length">
            <li v-for="song in searchState.excerpt.songs" :key="song.id" :song="song" is="song-card"/>
          </ul>
          <p v-else>None found.</p>
        </section>

        <section class="artists" data-testid="artist-excerpts">
          <h1>Artists</h1>
          <ul v-if="searchState.excerpt.artists.length">
            <li v-for="artist in searchState.excerpt.artists" :key="artist.id">
              <artist-card :artist="artist" layout="compact"/>
            </li>
          </ul>
          <p v-else>None found.</p>
        </section>

        <section class="albums" data-testid="album-excerpts">
          <h1>Albums</h1>
          <ul v-if="searchState.excerpt.albums.length">
            <li v-for="album in searchState.excerpt.albums" :key="album.id">
              <album-card :album="album" layout="compact"/>
            </li>
          </ul>
          <p v-else>None found.</p>
        </section>
      </div>
      <div class="screen-placeholder" v-else data-test="placeholder">
        <div>
          <i class="fa fa-search"></i>
          <p>Find songs, artists, and albums</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { eventBus } from '@/utils'
import { events } from '@/config'
import { searchStore } from '@/stores'
import router from '@/router'

export default Vue.extend({
  components: {
    ScreenHeader: () => import('@/components/ui/screen-header.vue'),
    SongCard: () => import('@/components/song/card.vue'),
    ArtistCard: () => import('@/components/artist/card.vue'),
    AlbumCard: () => import('@/components/album/card.vue'),
    Btn: () => import('@/components/ui/btn.vue')
  },

  data: () => ({
    searchState: searchStore.state,
    q: ''
  }),

  methods: {
    goToSongResults () {
      router.go(`search/songs/${this.q}`)
    }
  },

  created () {
    eventBus.on(events.SEARCH_KEYWORDS_CHANGED, (q: string) => {
      this.q = q
      searchStore.excerptSearch(q)
    })
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_mixins.scss";

.results > section {
  margin-bottom: 3em;
}

h1 {
  font-size: 1.4rem;
  margin: 0 0 1.8rem;
  font-weight: 100;
  display: flex;
  place-content: space-between;
}

section ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: .7em 1em;
}

.screen-placeholder {
  @include vertical-center();
  position: relative;
  height: 100%;
  opacity: .2;

  i {
    display: block;
    font-size: 6em;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }

  p {
    font-size: 2em;
    font-weight: 200;
  }

  div {
    text-align: center;
  }
}
</style>
