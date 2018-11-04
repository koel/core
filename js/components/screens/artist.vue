<template>
  <section id="artistWrapper">
    <h1 class="heading">
      <span class="overview">
        <img :src="image" width="64" height="64" class="cover">
        {{ artist.name }}
        <controls-toggler :showing-controls="showingControls" @toggleControls="toggleControls"/>

        <span class="meta" v-show="artist.songs.length">
          {{ artist.albums.length | pluralize('album') }}
          •
          {{ artist.songs.length | pluralize('song') }}
          •
          {{ fmtLength }}

          <template v-if="sharedState.useLastfm">
            •
            <a class="info" href @click.prevent="showInfo" title="View artist's extra information">Info</a>
          </template>

          <template v-if="sharedState.allowDownload">
            •
            <a class="download" href @click.prevent="download" title="Download all songs by this artist">
              Download All
            </a>
          </template>
        </span>
      </span>

      <song-list-controls
        v-show="artist.songs.length && (!isPhone || showingControls)"
        @shuffleAll="shuffleAll"
        @shuffleSelected="shuffleSelected"
        :config="songListControlConfig"
        :selectedSongs="selectedSongs"
      />
    </h1>

    <song-list :items="artist.songs" type="artist" ref="songList"/>

    <section class="info-wrapper" v-if="sharedState.useLastfm && meta.showing">
      <a href class="close" @click.prevent="meta.showing = false"><i class="fa fa-times"></i></a>
      <div class="inner">
        <div class="loading" v-if="meta.loading"><sound-bar/></div>
        <artist-info :artist="artist" mode="full" v-else/>
      </div>
    </section>
  </section>
</template>

<script>
import { pluralize } from '@/utils'
import { sharedStore } from '@/stores'
import { playback, download, artistInfo as artistInfoService } from '@/services'
import router from '@/router'
import hasSongList from '@/mixins/has-song-list'
import artistAttributes from '@/mixins/artist-attributes'

export default {
  mixins: [hasSongList, artistAttributes],

  props: {
    artist: {
      type: Object,
      required: true
    }
  },

  components: {
    ArtistInfo: () => import('@/components/artist/info.vue'),
    SoundBar: () => import('@/components/ui/sound-bar.vue')
  },

  filters: { pluralize },

  data: () => ({
    sharedState: sharedStore.state,
    meta: {
      showing: false,
      loading: true
    }
  }),

  watch: {
    /**
     * Watch the artist's album count.
     * If this is changed to 0, the user has edit the songs by this artist
     * and move all of them to another artist (thus delete this artist entirely).
     * We should then go back to the artist list.
     */
    'artist.albums.length': newAlbumCount => newAlbumCount || router.go('artists'),

    artist () {
      this.meta.showing = false
      // #530
      this.$refs.songList && this.$refs.songList.sort()
    }
  },

  methods: {
    /**
     * Shuffle the songs by the current artist.
     * Overriding the mixin.
     */
    shuffleAll () {
      playback.queueAndPlay(this.artist.songs, true /* shuffled */)
    },

    download () {
      download.fromArtist(this.artist)
    },

    async showInfo () {
      this.meta.showing = true

      if (!this.artist.info) {
        try {
          await artistInfoService.fetch(this.artist)
        } catch (e) {
        } finally {
          this.meta.loading = false
        }
      } else {
        this.meta.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#artistWrapper {
  button.play-shuffle {
    i {
      margin-right: 0 !important;
    }
  }

  .heading {
    .overview {
      position: relative;
      padding-left: 84px;

      @media only screen and (max-width : 768px) {
        padding-left: 0;
      }
    }

    .cover {
      position: absolute;
      left: 0;

      @media only screen and (max-width : 768px) {
        display: none;
      }
    }
  }

  @include artist-album-info-wrapper();
}
</style>
