<template>
  <section id="mainContent">
    <!--
      Most of the views are render-expensive and have their own UI states (viewport/scroll position), e.g. the song
      lists), so we use v-show.
      For those that don't need to maintain their own UI state, we use v-if and enjoy some codesplitting juice.
    -->
    <visualizer v-if="showingVisualizer"/>
    <album-art-overlay :album="currentAlbum" v-if="preferences.showAlbumArtOverlay"/>

    <home-screen v-show="view === $options.views.HOME"/>
    <queue-screen v-show="view === $options.views.QUEUE"/>
    <all-songs-screen v-show="view === $options.views.SONGS"/>
    <album-list-screen v-show="view === $options.views.ALBUMS"/>
    <artist-list-screen v-show="view === $options.views.ARTISTS"/>
    <playlist-screen v-show="view === $options.views.PLAYLIST"/>
    <favorites-screen v-show="view === $options.views.FAVORITES"/>
    <recently-played-screen v-show="view === $options.views.RECENTLY_PLAYED"/>

    <album-screen v-if="view === $options.views.ALBUM" :album="shownAlbum"/>
    <artist-screen v-if="view === $options.views.ARTIST" :artist="shownArtist"/>
    <settings-screen v-if="view === $options.views.SETTINGS"/>
    <profile-screen v-if="view === $options.views.PROFILE"/>
    <user-list-screen v-if="view === $options.views.USERS"/>
    <youtube-screen v-if="sharedState.useYouTube" v-show="view === $options.views.YOUTUBE"/>
  </section>
</template>

<script>
import { event } from '@/utils'
import { preferenceStore, sharedStore } from '@/stores'
import { views } from '@/config'
import HomeScreen from '@/components/screens/home'
import QueueScreen from '@/components/screens/queue'
import AlbumListScreen from '@/components/screens/album-list'
import ArtistListScreen from '@/components/screens/artist-list'
import AllSongsScreen from '@/components/screens/all-songs'
import PlaylistScreen from '@/components/screens/playlist'
import FavoritesScreen from '@/components/screens/favorites'
import RecentlyPlayedScreen from '@/components/screens/recently-played'
import UserListScreen from '@/components/screens/user-list'

export default {
  views,

  components: {
    HomeScreen,
    QueueScreen,
    AllSongsScreen,
    AlbumListScreen,
    ArtistListScreen,
    PlaylistScreen,
    FavoritesScreen,
    RecentlyPlayedScreen,
    UserListScreen,
    AlbumArtOverlay: () => import('@/components/ui/album-art-overlay'),
    AlbumScreen: () => import('@/components/screens/album'),
    ArtistScreen: () => import('@/components/screens/artist'),
    SettingsScreen: () => import('@/components/screens/settings'),
    ProfileScreen: () => import('@/components/screens/profile'),
    YoutubeScreen: () => import('@/components/screens/youtube'),
    Visualizer: () => import('@/components/ui/visualizer')
  },

  data: () => ({
    currentAlbum: null,
    preferences: preferenceStore.state,
    sharedState: sharedStore.state,
    showingVisualizer: false,
    shownArtist: null,
    shownAlbum: null,
    view: views.DEFAULT
  }),

  created () {
    event.on({
      [event.$names.LOAD_MAIN_CONTENT]: (view, data) => {
        switch (view) {
          case views.ALBUM:
            this.shownAlbum = data
            break
          case views.ARTIST:
            this.shownArtist = data
            break
        }

        this.view = view
      },

      [event.$names.SONG_PLAYED]: song => (this.currentAlbum = song.album),
      [event.$names.TOGGLE_VISUALIZER]: () => (this.showingVisualizer = !this.showingVisualizer)
    })
  }
}
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
