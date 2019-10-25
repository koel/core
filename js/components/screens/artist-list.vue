<template>
  <section id="artistsWrapper">
    <h1 class="heading">
      <span>Artists</span>
      <view-mode-switch :mode="viewMode" for="artists" @viewModeChanged="changeViewMode"/>
    </h1>

    <div ref="scroller" class="artists main-scroll-wrap" :class="`as-${viewMode}`" @scroll="scrolling">
      <artist-card v-for="item in displayedItems" :artist="item" :key="item.id"/>
      <to-top-button/>
    </div>
  </section>
</template>

<script>
import { filterBy, limitBy, event } from '@/utils'
import { artistStore } from '@/stores'

import infiniteScroll from '@/mixins/infinite-scroll'

export default {
  mixins: [infiniteScroll],
  components: {
    ArtistCard: () => import('@/components/artist/card'),
    ViewModeSwitch: () => import('@/components/ui/view-mode-switch')
  },

  data: () => ({
    perPage: 9,
    numOfItems: 9,
    q: '',
    viewMode: null,
    artists: []
  }),

  computed: {
    displayedItems () {
      return limitBy(this.filteredItems, this.numOfItems)
    },

    filteredItems () {
      return filterBy(this.artists, this.q, 'name')
    }
  },

  methods: {
    changeViewMode (mode) {
      this.viewMode = mode
    }
  },

  created () {
    event.on({
      [event.$names.KOEL_READY]: () => {
        this.artists = artistStore.all

        // #1086 solving not scrollable issue on very big screens
        if (this.$refs.scroller) {
          this.$nextTick(() => this.makeScrollable(this.$refs.scroller, this.artists.length))
        }
      },
      [event.$names.FILTER_CHANGED]: q => (this.q = q)
    })
  },

  mounted () {
    this.makeScrollable(this.$refs.scroller, this.artists.length)
  }
}
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
