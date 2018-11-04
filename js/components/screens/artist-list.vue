<template>
  <section id="artistsWrapper">
    <h1 class="heading">
      <span>Artists</span>
      <view-mode-switch :mode="viewMode" for="artists" @viewModeChanged="changeViewMode"/>
    </h1>

    <div class="artists main-scroll-wrap" :class="`as-${viewMode}`" @scroll="scrolling">
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
    ArtistCard: () => import('@/components/artist/card.vue'),
    ViewModeSwitch: () => import('@/components/ui/view-mode-switch.vue')
  },

  data () {
    return {
      perPage: 9,
      numOfItems: 9,
      q: '',
      viewMode: null,
      artists: []
    }
  },

  computed: {
    displayedItems () {
      return limitBy(
        filterBy(this.artists, this.q, 'name'),
        this.numOfItems
      )
    }
  },

  methods: {
    changeViewMode (mode) {
      this.viewMode = mode
    }
  },

  created () {
    event.on({
      [event.$names.KOEL_READY]: () => (this.artists = artistStore.all),
      [event.$names.FILTER_CHANGED]: q => (this.q = q)
    })
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
