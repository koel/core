<template>
  <section id="mainContent">
    <!--
      Most of the views are render-expensive and have their own UI states (viewport/scroll position), e.g. the song
      lists), so we use v-show.
      For those that don't need to maintain their own UI state, we use v-if and enjoy some codesplitting juice.
    -->
    <visualizer v-if="showingVisualizer"/>
    <album-art-overlay :album="currentAlbum" v-if="preferences.showAlbumArtOverlay"/>

    <home-screen v-show="view === views.HOME"/>
    <queue-screen v-show="view === views.QUEUE"/>
    <all-songs-screen v-show="view === views.SONGS"/>
    <album-list-screen v-show="view === views.ALBUMS"/>
    <artist-list-screen v-show="view === views.ARTISTS"/>
    <playlist-screen v-show="view === views.PLAYLIST"/>
    <favorites-screen v-show="view === views.FAVORITES"/>
    <recently-played-screen v-show="view === views.RECENTLY_PLAYED"/>

    <album-screen v-if="view === views.ALBUM" :album="shownAlbum"/>
    <artist-screen v-if="view === views.ARTIST" :artist="shownArtist"/>
    <settings-screen v-if="view === views.SETTINGS"/>
    <profile-screen v-if="view === views.PROFILE"/>
    <user-list-screen v-if="view === views.USERS"/>
    <youtube-screen v-if="sharedState.useYouTube" v-show="view === views.YOUTUBE"/>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { event } from '@/utils'
import { preferenceStore, sharedStore, artistStore, albumStore } from '@/stores'
import { views } from '@/config'
import HomeScreen from '@/components/screens/home.vue'
import QueueScreen from '@/components/screens/queue.vue'
import AlbumListScreen from '@/components/screens/album-list.vue'
import ArtistListScreen from '@/components/screens/artist-list.vue'
import AllSongsScreen from '@/components/screens/all-songs.vue'
import PlaylistScreen from '@/components/screens/playlist.vue'
import FavoritesScreen from '@/components/screens/favorites.vue'

export default Vue.extend({
  components: {
    HomeScreen,
    QueueScreen,
    AllSongsScreen,
    AlbumListScreen,
    ArtistListScreen,
    PlaylistScreen,
    FavoritesScreen,
    RecentlyPlayedScreen: () => import('@/components/screens/recently-played.vue'),
    UserListScreen: () => import('@/components/screens/user-list.vue'),
    AlbumArtOverlay: () => import('@/components/ui/album-art-overlay.vue'),
    AlbumScreen: () => import('@/components/screens/album.vue'),
    ArtistScreen: () => import('@/components/screens/artist.vue'),
    SettingsScreen: () => import('@/components/screens/settings.vue'),
    ProfileScreen: () => import('@/components/screens/profile.vue'),
    YoutubeScreen: () => import('@/components/screens/youtube.vue'),
    Visualizer: () => import('@/components/ui/visualizer.vue')
  },

  data: () => ({
    views,
    currentAlbum: albumStore.stub,
    preferences: preferenceStore.state,
    sharedState: sharedStore.state,
    showingVisualizer: false,
    shownArtist: artistStore.stub,
    shownAlbum: albumStore.stub,
    view: views.DEFAULT
  }),

  created () {
    event.on({
      [event.$names.LOAD_MAIN_CONTENT]: (view: string, data: Artist | Album): void => {
        switch (view) {
          case views.ALBUM:
            this.shownAlbum = data as Album
            break
          case views.ARTIST:
            this.shownArtist = data as Artist
            break
        }

        this.view = view
      },

      [event.$names.SONG_PLAYED]: (song: Song): void => {
        this.currentAlbum = song.album
      },

      [event.$names.TOGGLE_VISUALIZER]: (): void => {
        this.showingVisualizer = !this.showingVisualizer
      }
    })
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#mainContent {
  flex: 1;
  position: relative;
  overflow: hidden;

  > section {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    backface-visibility: hidden;

    .main-scroll-wrap {
      padding: 24px 24px 48px;
      overflow: auto;
      flex: 1;
      -ms-overflow-style: -ms-autohiding-scrollbar;
      place-content: start;

      html.touchevents & {
        // Enable scroll with momentum on touch devices
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
    }
  }

  h1.heading {
    font-weight: $fontWeight_UltraThin;
    font-size: 2.76rem;
    padding: 1rem 1.8rem;
    border-bottom: 1px solid $color2ndBgr;
    min-height: 96px;
    position: relative;
    align-items: center;
    align-content: stretch;
    display: flex;
    line-height: normal;
    background: rgba(0, 0, 0, .1);

    span:first-child {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .meta {
      display: block;
      font-size: .9rem;
      color: $color2ndText;
      margin: 6px 0 0 2px;

      a {
        color: #fff;

        &:hover {
          color: $colorHighlight;
        }
      }
    }

    .btn-group {
      text-align: right;
      z-index: 2;
    }
  }

  @media only screen and (max-width: 768px) {
    h1.heading {
      font-size: 1.38rem;
      min-height: 0;
      line-height: 1.85rem;
      text-align: center;
      flex-direction: column;

      .meta {
        display: none;
      }

      .buttons {
        justify-content: center;
        margin-top: 8px;
      }

      span:first-child {
        flex: 0 0 28px;
      }
    }

    > section {
      .main-scroll-wrap {
        padding: 12px;
      }
    }
  }

  @media only screen and (max-width: 375px) {
    > section {
      // Leave some space for the "Back to top" button
      .main-scroll-wrap {
        padding-bottom: 64px;
      }
    }
  }
}
</style>
