<template>
  <section id="artistsWrapper">
    <h1 class="heading">
      <span>Artists</span>
      <view-mode-switch v-model="viewMode"/>
    </h1>

    <div ref="scroller" class="artists main-scroll-wrap" :class="`as-${viewMode}`" @scroll="scrolling">
      <artist-card v-for="item in displayedItems" :artist="item" :key="item.id"/>
      <to-top-button/>
    </div>
  </section>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { filterBy, limitBy, eventBus } from '@/utils'
import { events } from '@/config'
import { artistStore, preferenceStore as preferences } from '@/stores'
import infiniteScroll from '@/mixins/infinite-scroll.ts'

export default mixins(infiniteScroll).extend({
  components: {
    ArtistCard: () => import('@/components/artist/card.vue'),
    ViewModeSwitch: () => import('@/components/ui/view-mode-switch.vue')
  },

  data: () => ({
    perPage: 9,
    displayedItemCount: 9,
    q: '',
    viewMode: '',
    artists: [] as Artist[]
  }),

  computed: {
    displayedItems (): Artist[] {
      return limitBy(this.filteredItems, this.displayedItemCount)
    },

    filteredItems (): Artist[] {
      return filterBy(this.artists, this.q, 'name')
    }
  },

  watch: {
    viewMode (): void {
      preferences.artistsViewMode = this.viewMode
    }
  },

  created (): void {
    eventBus.on({
      [events.KOEL_READY]: (): void => {
        this.artists = artistStore.all
        this.viewMode = preferences.artistsViewMode || 'thumbnails'
      },

      [events.LOAD_MAIN_CONTENT]: (view: MainViewName): void => {
        if (view === 'Artists') {
          this.$nextTick((): void => this.makeScrollable(this.$refs.scroller as HTMLElement, this.artists.length))
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

#artistsWrapper {
  .artists {
    @include artist-album-wrapper();
  }
}
</style>
