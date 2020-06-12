<template>
  <section id="homeWrapper">
    <h1 class="heading">
      <span>{{ greeting }}</span>
    </h1>

    <div class="main-scroll-wrap" @scroll="scrolling" ref="wrapper">
      <div class="two-cols">
        <section v-show="top.songs.length">
          <h1>Most Played</h1>

          <ol class="top-song-list">
            <li v-for="song in top.songs"
              :top-play-count="top.songs.length ? top.songs[0].playCount : 0"
              :song="song"
              :key="song.id"
              is="song-item"/>
          </ol>
        </section>

        <section class="recent">
          <h1>Recently Played
            <btn @click.prevent="goToRecentlyPlayedScreen" rounded small orange>View All</btn>
          </h1>

          <ol class="recent-song-list" v-show="recentSongs.length">
            <li v-for="song in recentSongs"
              :top-play-count="top.songs.length ? top.songs[0].playCount : 0"
              :song="song"
              :key="song.id"
              is="song-item"></li>
          </ol>

          <p class="none" v-show="!recentSongs.length">
            Your recently played songs will be displayed here.<br />
            Start listening!
          </p>
        </section>
      </div>

      <section class="recently-added" v-show="showRecentlyAddedSection">
        <h1>Recently Added</h1>

        <div class="two-cols">
          <div class="wrapper as-list">
            <album-card v-for="album in recentlyAdded.albums" :album="album" :key="album.id"/>
          </div>
          <div>
            <ul class="recently-added-song-list" v-show="recentlyAdded.songs.length">
              <li v-for="song in recentlyAdded.songs" :song="song" :key="song.id" is="song-item"></li>
            </ul>
          </div>
        </div>
      </section>

      <section class="top-artists" v-show="top.artists.length">
        <h1>Top Artists</h1>

        <div class="wrapper" :class="`as-${preferences.artistsViewMode}`">
          <artist-card v-for="artist in top.artists" :artist="artist" :key="artist.id"/>
        </div>
      </section>

      <section class="top-albums" v-show="top.albums.length">
        <h1>Top Albums</h1>

        <div class="wrapper" :class="`as-${preferences.albumsViewMode}`">
          <album-card v-for="album in top.albums" :album="album" :key="album.id"/>
        </div>
      </section>

      <to-top-button/>
    </div>
  </section>
</template>

<script lang="ts">
import { sample } from 'lodash'
import mixins from 'vue-typed-mixins'

import { eventBus } from '@/utils'
import { events } from '@/config'
import { songStore, albumStore, artistStore, recentlyPlayedStore, userStore, preferenceStore } from '@/stores'
import infiniteScroll from '@/mixins/infinite-scroll.ts'
import router from '@/router'

export default mixins(infiniteScroll).extend({
  components: {
    AlbumCard: () => import('@/components/album/card.vue'),
    ArtistCard: () => import('@/components/artist/card.vue'),
    SongItem: () => import('@/components/song/home-item.vue'),
    Btn: () => import('@/components/ui/btn.vue')
  },

  data: () => ({
    greetings: [
      'Oh hai!',
      'Hey, %s!',
      'Howdy, %s!',
      'Yo!',
      'How’s it going, %s?',
      'Sup, %s?',
      'How’s life, %s?',
      'How’s your day, %s?',
      'How have you been, %s?'
    ],
    recentSongs: [] as Song[],
    top: {
      songs: [] as Song[],
      albums: [] as Album[],
      artists: [] as Artist[]
    },
    recentlyAdded: {
      albums: [] as Album[],
      songs: [] as Song[]
    },

    preferences: preferenceStore.state
  }),

  computed: {
    greeting (): string {
      return sample(this.greetings)!.replace('%s', userStore.current.name)
    },

    showRecentlyAddedSection (): boolean {
      return Boolean(this.recentlyAdded.albums.length || this.recentlyAdded.songs.length)
    }
  },

  methods: {
    refreshDashboard (): void {
      this.top.songs = songStore.getMostPlayed(7)
      this.top.albums = albumStore.getMostPlayed(6)
      this.top.artists = artistStore.getMostPlayed(6)
      this.recentlyAdded.albums = albumStore.getRecentlyAdded(6)
      this.recentlyAdded.songs = songStore.getRecentlyAdded(10)
      this.recentSongs = recentlyPlayedStore.excerptState.songs
    },

    goToRecentlyPlayedScreen: (): void => router.go('recently-played')
  },

  created (): void {
    eventBus.on({
      [events.KOEL_READY]: (): void => this.refreshDashboard(),
      [events.SONG_STARTED]: (): void => this.refreshDashboard(),
      [events.SONG_UPLOADED]: (): void => this.refreshDashboard()
    })
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#homeWrapper {
  .two-cols {
    display: flex;

    > section, > div {
      flex-grow: 1;
      flex-basis: 0;

      &:first-of-type {
        margin-right: 8px;
      }
    }
  }

  .recent {
    h1 button {
      float: right;
      padding: 6px 10px;
      margin-top: -3px;
    }
  }

  .none {
    color: $color2ndText;
    padding: 0;

    a {
      color: $colorHighlight;
    }
  }

  .recently-added {
    .song-item-home .details {
      background: rgba(255, 255, 255, .02);
    }
  }

  .top-artists .wrapper, .top-albums .wrapper, .recently-added .wrapper {
    @include artist-album-wrapper();
  }

  .main-scroll-wrap {
    section {
      margin-bottom: 48px;
    }

    h1 {
      font-size: 1.4rem;
      margin: 0 0 1.8rem;
      font-weight: $fontWeight_UltraThin;
    }
  }

  @media only screen and (max-width: 768px) {
    .two-cols {
      display: block;

      > section, > div {
        &:first-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
