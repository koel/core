<template>
  <section id="mainContent">
    <!--
      Most of the views are render-expensive and have their own UI states (viewport/scroll position), e.g. the song
      lists), so we use v-show.
      For those that don't need to maintain their own UI state, we use v-if and enjoy some codesplitting juice.
    -->
    <visualizer v-if="showingVisualizer"/>
    <album-art-overlay v-if="preferences.showAlbumArtOverlay"/>

    <home-screen v-show="view === 'Home'"/>
    <queue-screen v-show="view === 'Queue'"/>
    <all-songs-screen v-show="view === 'Songs'"/>
    <album-list-screen v-show="view === 'Albums'"/>
    <artist-list-screen v-show="view === 'Artists'"/>
    <playlist-screen v-show="view === 'Playlist'"/>
    <favorites-screen v-show="view === 'Favorites'"/>
    <recently-played-screen v-show="view === 'RecentlyPlayed'"/>
    <upload-screen v-show="view === 'Upload'"/>

    <album-screen v-if="view === 'Album'" :album="shownAlbum"/>
    <artist-screen v-if="view === 'Artist'" :artist="shownArtist"/>
    <settings-screen v-if="view === 'Settings'"/>
    <profile-screen v-if="view === 'Profile'"/>
    <user-list-screen v-if="view === 'Users'"/>
    <youtube-screen v-if="sharedState.useYouTube" v-show="view === 'YouTube'"/>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { eventBus } from '@/utils'
import { events } from '@/config'
import { preferenceStore, sharedStore, artistStore, albumStore } from '@/stores'
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
    UploadScreen: () => import('@/components/screens/upload.vue'),
    Visualizer: () => import('@/components/ui/visualizer.vue')
  },

  data: () => ({
    preferences: preferenceStore.state,
    sharedState: sharedStore.state,
    showingVisualizer: false,
    shownArtist: artistStore.stub,
    shownAlbum: albumStore.stub,
    view: 'Home'
  }),

  created (): void {
    eventBus.on({
      [events.LOAD_MAIN_CONTENT]: (view: MainViewName, data: Artist | Album): void => {
        switch (view) {
          case 'Album':
            this.shownAlbum = data as Album
            break

          case 'Artist':
            this.shownArtist = data as Artist
            break
        }

        this.view = view
      },

      [events.TOGGLE_VISUALIZER]: (): void => {
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
