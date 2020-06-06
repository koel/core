<template>
  <section id="albumsWrapper">
    <h1 class="heading">
      <span>Albums</span>
      <view-mode-switch v-model="viewMode"/>
    </h1>

    <div ref="scroller" class="albums main-scroll-wrap" :class="`as-${viewMode}`" @scroll="scrolling">
      <album-card v-for="item in displayedItems" :album="item" :key="item.id"/>
      <to-top-button/>
    </div>
  </section>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { filterBy, limitBy, eventBus } from '@/utils'
import { events } from '@/config'
import { albumStore, preferenceStore as preferences } from '@/stores'
import infiniteScroll from '@/mixins/infinite-scroll.ts'

export default mixins(infiniteScroll).extend({
  components: {
    AlbumCard: () => import('@/components/album/card.vue'),
    ViewModeSwitch: () => import('@/components/ui/view-mode-switch.vue')
  },

  data: () => ({
    perPage: 9,
    displayedItemCount: 9,
    q: '',
    viewMode: '',
    albums: [] as Album[]
  }),

  computed: {
    displayedItems (): Album[] {
      return limitBy(this.filteredItems, this.displayedItemCount)
    },

    filteredItems (): Album[] {
      return filterBy(this.albums, this.q, 'name', 'artist.name')
    }
  },

  watch: {
    viewMode (): void {
      preferences.albumsViewMode = this.viewMode
    }
  },

  created (): void {
    eventBus.on({
      [events.KOEL_READY]: (): void => {
        this.albums = albumStore.all
        this.viewMode = preferences.albumsViewMode || 'thumbnails'
      },

      [events.LOAD_MAIN_CONTENT]: (view: MainViewName): void => {
        if (view === 'Albums') {
          this.$nextTick((): void => this.makeScrollable(this.$refs.scroller as HTMLElement, this.albums.length))
        }
      },

      [events.FILTER_CHANGED]: (q: string): void => {
        this.q = q
      }
    })
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#albumsWrapper {
  .albums {
    @include artist-album-wrapper();
  }
}
</style>
