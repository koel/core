<template>
  <section id="extra" :class="{ showing: state.showExtraPanel }">
    <div class="tabs">
      <div class="clear" role="tablist">
        <button
          :aria-selected="currentTab === tabs.Lyrics"
          @click.prevent="currentTab = tabs.Lyrics"
          aria-controls="extraPanelLyrics"
          id="extraTabLyrics"
          role="tab"
        >
          Lyrics
        </button>
        <button
          :aria-selected="currentTab === tabs.Artist"
          @click.prevent="currentTab = tabs.Artist"
          aria-controls="extraPanelArtist"
          id="extraTabArtist"
          role="tab"
        >
          Artist
        </button>
        <button
          :aria-selected="currentTab === tabs.Album"
          @click.prevent="currentTab = tabs.Album"
          aria-controls="extraPanelAlbum"
          id="extraTabAlbum"
          role="tab"
        >
          Album
        </button>
        <button
          :aria-selected="currentTab === tabs.YouTube"
          @click.prevent="currentTab = tabs.YouTube"
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
          v-show="currentTab === tabs.Lyrics"
        >
          <lyrics-pane :song="song" />
        </div>

        <div
          aria-labelledby="extraTabArtist"
          id="extraPanelArtist"
          role="tabpanel"
          tabindex="0"
          v-show="currentTab === tabs.Artist"
        >
          <artist-info v-if="song.artist.id" :artist="song.artist" mode="sidebar"/>
        </div>

        <div
          aria-labelledby="extraTabAlbum"
          id="extraPanelAlbum"
          role="tabpanel"
          tabindex="0"
          v-show="currentTab === tabs.Album"
        >
          <album-info v-if="song.album.id" :album="song.album" mode="sidebar"/>
        </div>

        <div
          aria-labelledby="extraTabAlbum"
          id="extraPanelAlbum"
          role="tabpanel"
          tabindex="0"
          v-show="currentTab === tabs.YouTube"
        >
          <you-tube-video-list v-if="sharedState.useYouTube" :song="song" :youtube="song.youtube"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import isMobile from 'ismobilejs'
import Vue from 'vue'
import { event, $ } from '@/utils'
import { sharedStore, songStore, preferenceStore as preferences } from '@/stores'
import { songInfo } from '@/services'

enum Tab {
  Lyrics,
  Artist,
  Album,
  YouTube
}

export default Vue.extend({
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
    currentTab: Tab.Lyrics,
    tabs: Tab
  }),

  watch: {
    /**
     * Watch the "showExtraPanel" property to add/remove the corresponding class
     * to/from the html tag.
     * Some element's CSS can then be controlled based on this class.
     */
    'state.showExtraPanel': (showingExtraPanel: boolean): void => {
      if (showingExtraPanel && !isMobile.any) {
        $.addClass(document.documentElement, 'with-extra-panel')
      } else {
        $.removeClass(document.documentElement, 'with-extra-panel')
      }
    }
  },

  methods: {
    resetState (): void {
      this.currentTab = Tab.Lyrics
      this.song = songStore.stub
    },

    async fetchSongInfo (song: Song): Promise<void> {
      try {
        this.song = await songInfo.fetch(song)
      } catch (err) {
        this.song = song
        throw err
      }
    }
  },

  created () {
    event.on({
      [event.$names.SONG_PLAYED]: async (song: Song): Promise<void> => await this.fetchSongInfo(song),
      [event.$names.LOAD_MAIN_CONTENT]: (): void => {
        // On ready, add 'with-extra-panel' class.
        if (!isMobile.any) {
          $.addClass(document.documentElement, 'with-extra-panel')
        }

        // Hide the extra panel if on mobile
        if (isMobile.phone) {
          this.state.showExtraPanel = false
        }
      }
    })
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#extra {
  flex: 0 0 $extraPanelWidth;
  padding: 24px 16px;
  background: $colorExtraBgr;
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
    height: calc(100vh - #{$headerHeight});
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
