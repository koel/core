<template>
  <section id="extra" :class="{ showing: state.showExtraPanel }">
    <div class="tabs">
      <div class="header clear">
        <a @click.prevent="currentView = 'lyrics'"
          class="lyrics"
          :class="{ active: currentView === 'lyrics' }">Lyrics</a>
        <a @click.prevent="currentView = 'artistInfo'"
          class="artist"
          :class="{ active: currentView === 'artistInfo' }">Artist</a>
        <a @click.prevent="currentView = 'albumInfo'"
          class="album"
          :class="{ active: currentView === 'albumInfo' }">Album</a>
        <a @click.prevent="currentView = 'youtube'"
          v-if="sharedState.useYouTube"
          class="youtube"
          :class="{ active: currentView === 'youtube' }"><i class="fa fa-youtube-play"></i></a>
      </div>

      <div class="panes">
        <lyrics-pane :song="song" ref="lyrics" v-show="currentView === 'lyrics'"/>
        <artist-info v-if="song.artist.id"
          :artist="song.artist"
          mode="sidebar"
          ref="artist-info"
          v-show="currentView === 'artistInfo'"/>
        <album-info v-if="song.album.id"
          :album="song.album"
          mode="sidebar"
          ref="album-info"
          v-show="currentView === 'albumInfo'"/>
        <you-tube-video-list v-if="sharedState.useYouTube"
          :song="song"
          :youtube="song.youtube"
          ref="youtube"
          v-show="currentView === 'youtube'"/>
      </div>
    </div>
  </section>
</template>

<script>
import isMobile from 'ismobilejs'

import { event, $ } from '@/utils'
import { sharedStore, songStore, preferenceStore as preferences } from '@/stores'
import { songInfo } from '@/services'

export default {
  components: {
    LyricsPane: () => import('@/components/ui/lyrics-pane.vue'),
    ArtistInfo: () => import('@/components/artist/info.vue'),
    AlbumInfo: () => import('@/components/album/info.vue'),
    YouTubeVideoList: () => import('@/components/ui/youtube-video-list.vue')
  },

  data () {
    return {
      song: songStore.stub,
      state: preferences.state,
      sharedState: sharedStore.state,
      currentView: 'lyrics'
    }
  },

  watch: {
    /**
     * Watch the "showExtraPanel" property to add/remove the corresponding class
     * to/from the html tag.
     * Some element's CSS can then be controlled based on this class.
     */
    'state.showExtraPanel' (showingExtraPanel) {
      if (showingExtraPanel && !isMobile.any) {
        $.addClass(document.documentElement, 'with-extra-panel')
      } else {
        $.removeClass(document.documentElement, 'with-extra-panel')
      }
    }
  },

  mounted () {
    // On ready, add 'with-extra-panel' class.
    if (!isMobile.any) {
      $.addClass(document.documentElement, 'with-extra-panel')
    }

    if (isMobile.phone) {
      // On a mobile device, we always hide the panel initially regardless of
      // the saved preference.
      preferences.showExtraPanel = false
    }
  },

  methods: {
    resetState () {
      this.currentView = 'lyrics'
      this.song = songStore.stub
    },

    async fetchSongInfo (song) {
      try {
        this.song = await songInfo.fetch(song)
      } catch (err) {
        this.song = song
      }
    }
  },

  created () {
    event.on({
      // Hide the panel away if a main view is triggered on mobile.
      [event.$names.LOAD_MAIN_CONTENT]: () => (isMobile.phone && (preferences.showExtraPanel = false)),
      [event.$names.SONG_PLAYED]: song => this.fetchSongInfo(song)
    })
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#extra {
  flex: 0 0 $extraPanelWidth;
  padding: 24px 16px $footerHeight;
  background: $colorExtraBgr;
  max-height: calc(100vh - #{$headerHeight + $footerHeight});
  display: none;
  color: $color2ndText;
  overflow: auto;
  -ms-overflow-style: -ms-autohiding-scrollbar;

  html.touchevents & {
    // Enable scroll with momentum on touch devices
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  &.showing {
    display: block;
  }

  h1 {
    font-weight: $fontWeight_UltraThin;
    font-size: 2.2rem;
    margin-bottom: 16px;
    line-height: 2.8rem;
  }

  @media only screen and (max-width : 1024px) {
    position: fixed;
    height: calc(100vh - #{$headerHeight + $footerHeight});
    padding-bottom: $footerHeight; // make sure the footer can never overlap the content
    width: $extraPanelWidth;
    z-index: 5;
    top: $headerHeight;
    right: -100%;
    transition: right .3s ease-in;

    &.showing {
      right: 0;
    }
  }

  @media only screen and (max-width : 667px) {
    width: 100%;
  }
}
</style>
