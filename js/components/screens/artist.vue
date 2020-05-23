<template>
  <section id="artistWrapper">
    <h1 class="heading">
      <span class="overview">
        <span class="thumbnail-wrapper">
          <artist-thumbnail :entity="artist" />
        </span>

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
            <a
              @click.prevent="download"
              class="download"
              href
              role="button"
              title="Download all songs by this artist"
            >
              Download All
            </a>
          </template>
        </span>
      </span>

      <song-list-controls
        v-show="artist.songs.length && (!isPhone || showingControls)"
        @playAll="playAll"
        @playSelected="playSelected"
        :songs="artist.songs"
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

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { pluralize } from '@/utils'
import { sharedStore } from '@/stores'
import { download, artistInfo as artistInfoService } from '@/services'
import router from '@/router'
import hasSongList from '@/mixins/has-song-list.ts'
import artistAttributes from '@/mixins/artist-attributes.ts'

export default mixins(hasSongList, artistAttributes).extend({
  components: {
    ArtistInfo: () => import('@/components/artist/info.vue'),
    SoundBar: () => import('@/components/ui/sound-bar.vue'),
    ArtistThumbnail: () => import('@/components/ui/album-artist-thumbnail.vue')
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
    'artist.albums.length': (newAlbumCount: number): void => {
      if (!newAlbumCount) {
        router.go('artists')
      }
    },

    artist (): void {
      this.meta.showing = false
      // #530
      this.$refs.songList && (this.$refs.songList as any).sort()
    }
  },

  methods: {
    getSongsToPlay (): Song[] {
      // @ts-ignore
      return this.$refs.songList.getAllSongsWithSort()
    },

    download (): void {
      download.fromArtist(this.artist)
    },

    async showInfo (): Promise<void> {
      this.meta.showing = true

      if (!this.artist.info) {
        try {
          await artistInfoService.fetch(this.artist)
        } catch (e) {
          /* eslint no-console: 0 */
          console.error(e)
        } finally {
          this.meta.loading = false
        }
      } else {
        this.meta.loading = false
      }
    }
  }
})
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
      .thumbnail-wrapper {
        display: block;
        width: 64px;
        position: absolute;
        left: 0;

        @media only screen and (max-width : 768px) {
          display: none;
        }
      }

      position: relative;
      padding-left: 84px;

      @media only screen and (max-width : 768px) {
        padding-left: 0;
      }
    }
  }

  @include artist-album-info-wrapper();
}
</style>
