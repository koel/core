<template>
  <section id="mainContent">
    <!--
      Most of the views are render-expensive and have their own UI states (viewport/scroll position), e.g. the song
      lists), so we use v-show.
      For those that don't need to maintain their own UI state, we use v-if and enjoy some codesplitting juice.
    -->
    <visualizer v-if="showingVisualizer"/>

    <div class="translucent" :style="{ backgroundImage: albumCover ? `url(${albumCover})` : 'none' }"></div>

    <home-screen v-show="view === 'home'"/>
    <queue-screen v-show="view === 'queue'"/>
    <all-songs-screen v-show="view === 'songs'"/>
    <album-list-screen v-show="view === 'albums'"/>
    <artist-list-screen v-show="view === 'artists'"/>
    <playlist-screen v-show="view === 'playlist'"/>
    <favorites-screen v-show="view === 'favorites'"/>
    <recently-played-screen v-show="view === 'recently-played'"/>

    <album-screen v-if="view === 'album'" :album="shownAlbum"/>
    <artist-screen v-if="view === 'artist'" :artist="shownArtist"/>
    <user-list-screen v-if="view === 'users'"/>
    <settings-screen v-if="view === 'settings'"/>
    <profile-screen v-if="view === 'profile'"/>
    <youtube-screen v-if="sharedState.useYouTube" v-show="view === 'youtubePlayer'"/>
  </section>
</template>

<script>
import { event } from '@/utils'
import { albumStore, sharedStore } from '@/stores'

export default {
  components: {
    AlbumListScreen: () => import('@/components/screens/album-list.vue'),
    AlbumScreen: () => import('@/components/screens/album.vue'),
    ArtistListScreen: () => import('@/components/screens/artist-list.vue'),
    ArtistScreen: () => import('@/components/screens/artist.vue'),
    AllSongsScreen: () => import('@/components/screens/all-songs.vue'),
    SettingsScreen: () => import('@/components/screens/settings.vue'),
    UserListScreen: () => import('@/components/screens/user-list.vue'),
    HomeScreen: () => import('@/components/screens/home.vue'),
    QueueScreen: () => import('@/components/screens/queue.vue'),
    PlaylistScreen: () => import('@/components/screens/playlist.vue'),
    FavoritesScreen: () => import('@/components/screens/favorites.vue'),
    RecentlyPlayedScreen: () => import('@/components/screens/recently-played.vue'),
    ProfileScreen: () => import('@/components/screens/profile.vue'),
    YoutubeScreen: () => import('@/components/screens/youtube.vue'),
    Visualizer: () => import('@/components/ui/visualizer.vue')
  },

  data: () => ({
    view: 'home',
    albumCover: null,
    sharedState: sharedStore.state,
    showingVisualizer: false,
    shownArtist: null,
    shownAlbum: null
  }),

  created () {
    event.on({
      [event.$names.LOAD_MAIN_CONTENT]: (view, data) => {
        switch (view) {
          case 'album':
            this.shownAlbum = data
            break
          case 'artist':
            this.shownArtist = data
            break
        }

        this.view = view
      },

      /**
       * When a new song is played, find its cover for the translucent effect.
       */
      [event.$names.SONG_PLAYED]: song => {
        this.albumCover = song.album.cover === albumStore.stub.cover ? null : song.album.cover
      },

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

    .buttons {
      text-align: right;
      z-index: 2;

      @include button-group();
    }
  }

  .translucent {
    position: fixed;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    filter: blur(20px);
    opacity: .07;
    z-index: 10000;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
    pointer-events: none;
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
