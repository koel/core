<template>
  <section id="extra" :class="{ showing: state.showExtraPanel }">
    <div class="tabs">
      <div class="clear" role="tablist">
        <button
          :aria-selected="currentView === 'lyrics'"
          @click.prevent="currentView = 'lyrics'"
          aria-controls="extraPanelLyrics"
          id="extraTabLyrics"
          role="tab"
        >
          Lyrics
        </button>
        <button
          :aria-selected="currentView === 'artistInfo'"
          @click.prevent="currentView = 'artistInfo'"
          aria-controls="extraPanelArtist"
          id="extraTabArtist"
          role="tab"
        >
          Artist
        </button>
        <button
          :aria-selected="currentView === 'albumInfo'"
          @click.prevent="currentView = 'albumInfo'"
          aria-controls="extraPanelAlbum"
          id="extraTabAlbum"
          role="tab"
        >
          Album
        </button>
        <button
          :aria-selected="currentView === 'youtube'"
          @click.prevent="currentView = 'youtube'"
          aria-controls="extraPanelYouTube"
          id="extraTabYouTube"
          role="tab"
          title="YouTube"
          v-if="sharedState.useYouTube"
        >
          <i class="fa fa-youtube-play"></i>
        </button>
      </div>

      <div class="panes">
        <div
          aria-labelledby="extraTabLyrics"
          id="extraPanelLyrics"
          role="tabpanel"
          tabindex="0"
          v-show="currentView === 'lyrics'"
        >
          <lyrics-pane :song="song" />
        </div>

        <div
          aria-labelledby="extraTabArtist"
          id="extraPanelArtist"
          role="tabpanel"
          tabindex="0"
          v-show="currentView === 'artistInfo'"
        >
          <artist-info v-if="song.artist.id" :artist="song.artist" mode="sidebar"/>
        </div>

        <div
          aria-labelledby="extraTabAlbum"
          id="extraPanelAlbum"
          role="tabpanel"
          tabindex="0"
          v-show="currentView === 'albumInfo'"
        >
          <album-info v-if="song.album.id" :album="song.album" mode="sidebar"/>
        </div>

        <div
          aria-labelledby="extraTabAlbum"
          id="extraPanelAlbum"
          role="tabpanel"
          tabindex="0"
          v-show="currentView === 'youtube'"
        >
          <you-tube-video-list v-if="sharedState.useYouTube" :song="song" :youtube="song.youtube"/>
        </div>
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

  data: () => ({
    song: songStore.stub,
    state: preferences.state,
    sharedState: sharedStore.state,
    currentView: 'lyrics'
  }),

  watch: {
    /**
     * Watch the "showExtraPanel" property to add/remove the corresponding class
     * to/from the html tag.
     * Some element's CSS can then be controlled based on this class.
     */
    'state.showExtraPanel': showingExtraPanel => {
      if (showingExtraPanel && !isMobile.any) {
        $.addClass(document.documentElement, 'with-extra-panel')
      } else {
        $.removeClass(document.documentElement, 'with-extra-panel')
      }
    }
  },

  mounted: () => {
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
