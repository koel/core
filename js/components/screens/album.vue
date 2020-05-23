<template>
  <section id="albumWrapper">
    <h1 class="heading">
      <span class="overview">
        <span class="thumbnail-wrapper">
          <album-thumbnail :entity="album"/>
        </span>

        {{ album.name }}
        <controls-toggler :showing-controls="showingControls" @toggleControls="toggleControls"/>

        <span class="meta" v-show="album.songs.length">
          by
          <a class="artist" v-if="isNormalArtist" :href="`#!/artist/${album.artist.id}`">{{ album.artist.name }}</a>
          <span class="nope" v-else>{{ album.artist.name }}</span>
          •
          {{ album.songs.length | pluralize('song') }}
          •
          {{ fmtLength }}

          <template v-if="sharedState.useLastfm">
            •
            <a class="info" href @click.prevent="showInfo" title="View album's extra information">Info</a>
          </template>
          <template v-if="sharedState.allowDownload">
            •
            <a class="download" href @click.prevent="download" title="Download all songs in album" role="button">
              Download All
            </a>
          </template>
        </span>
      </span>

      <song-list-controls
        v-show="album.songs.length && (!isPhone || showingControls)"
        @playAll="playAll"
        @playSelected="playSelected"
        :songs="album.songs"
        :config="songListControlConfig"
        :selectedSongs="selectedSongs"
      />
    </h1>

    <song-list :items="album.songs" type="album" ref="songList"/>

    <section class="info-wrapper" v-if="sharedState.useLastfm && meta.showing">
      <a href class="close" @click.prevent="meta.showing = false"><i class="fa fa-times"></i></a>
      <div class="inner">
        <div class="loading" v-if="meta.loading"><sound-bar/></div>
        <album-info :album="album" mode="full" v-else/>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { pluralize } from '@/utils'
import { artistStore, sharedStore } from '@/stores'
import { download, albumInfo as albumInfoService } from '@/services'
import router from '@/router'
import hasSongList from '@/mixins/has-song-list.ts'
import albumAttributes from '@/mixins/album-attributes.ts'

export default mixins(hasSongList, albumAttributes).extend({
  components: {
    AlbumInfo: () => import('@/components/album/info.vue'),
    SoundBar: () => import('@/components/ui/sound-bar.vue'),
    AlbumThumbnail: () => import('@/components/ui/album-artist-thumbnail.vue')
  },

  filters: { pluralize },

  data: () => ({
    sharedState: sharedStore.state,
    meta: {
      showing: false,
      loading: true
    }
  }),

  computed: {
    isNormalArtist (): boolean {
      return !artistStore.isVariousArtists(this.album.artist) &&
        !artistStore.isUnknownArtist(this.album.artist)
    }
  },

  watch: {
    /**
     * Watch the album's song count.
     * If this is changed to 0, the user has edit the songs in this album
     * and move all of them into another album.
     * We should then go back to the album list.
     */
    'album.songs.length': (newSongCount: number): void => {
      if (!newSongCount) {
        router.go('albums')
      }
    },

    album (): void {
      this.meta.showing = false
      // #530
      if (this.$refs.songList) {
        (this.$refs.songList as any).sort()
      }
    }
  },

  methods: {
    getSongsToPlay (): Song[] {
      // @ts-ignore
      return this.$refs.songList.getAllSongsWithSort()
    },

    download (): void {
      download.fromAlbum(this.album)
    },

    async showInfo (): Promise<void> {
      this.meta.showing = true

      if (!this.album.info) {
        try {
          await albumInfoService.fetch(this.album)
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

#albumWrapper {
  button.play-shuffle {
    i {
      margin-right: 0 !important;
    }
  }

  .heading {
    .overview {
      position: relative;
      padding-left: 84px;

      .thumbnail-wrapper {
        display: block;
        width: 64px;
        position: absolute;
        left: 0;

        @media only screen and (max-width : 768px) {
          display: none;
        }
      }

      @media only screen and (max-width : 768px) {
        padding-left: 0;
      }
    }

    a.artist {
      color: $colorMainText;
      display: inline;

      &:hover {
        color: $colorHighlight;
      }
    }
  }

  @include artist-album-info-wrapper();
}
</style>
