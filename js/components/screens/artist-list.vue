<template>
  <section id="artistsWrapper">
    <h1 class="heading">
      <span>Artists</span>
      <view-mode-switch for="artists" @viewModeChanged="changeViewMode"/>
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
import { artistStore } from '@/stores'
import infiniteScroll from '@/mixins/infinite-scroll.ts'

export default mixins(infiniteScroll).extend({
  components: {
    ArtistCard: () => import('@/components/artist/card.vue'),
    ViewModeSwitch: () => import('@/components/ui/view-mode-switch.vue')
  },

  data: () => ({
    perPage: 9,
    numOfItems: 9,
    q: '',
    viewMode: '',
    artists: [] as Artist[]
  }),

  computed: {
    displayedItems (): Artist[] {
      return limitBy(this.filteredItems, this.numOfItems)
    },

    filteredItems (): Artist[] {
      return filterBy(this.artists, this.q, 'name')
    }
  },

  methods: {
    changeViewMode (mode: string): void {
      this.viewMode = mode
    }
  },

  created (): void {
    eventBus.on({
      [events.KOEL_READY]: (): void => {
        this.artists = artistStore.all

        // #1086 solving not scrollable issue on very big screens
        if (this.$refs.scroller) {
          this.$nextTick((): void => this.makeScrollable(this.$refs.scroller as HTMLElement, this.artists.length))
        }
      },

      [events.FILTER_CHANGED]: (q: string): void => {
        this.q = q
      }
    })
  },

  mounted (): void {
    this.makeScrollable(this.$refs.scroller as HTMLElement, this.artists.length)
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
