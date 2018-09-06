<template>
  <section id="albumsWrapper">
    <h1 class="heading">
      <span>Albums</span>
      <view-mode-switch :mode="viewMode" for="albums" @viewModeChanged="changeViewMode"/>
    </h1>

    <div ref="scroller" class="albums main-scroll-wrap" :class="`as-${viewMode}`" @scroll="scrolling">
      <album-item v-for="item in displayedItems" :album="item" :key="item.id"/>
      <to-top-button/>
    </div>
  </section>
</template>

<script>
import { filterBy, limitBy, event } from '@/utils'
import { albumStore } from '@/stores'
import infiniteScroll from '@/mixins/infinite-scroll'

export default {
  name: 'main-wrapper--main-content--albums',
  mixins: [infiniteScroll],

  components: {
    albumItem: () => import('@/components/shared/album-item.vue'),
    viewModeSwitch: () => import('@/components/shared/view-mode-switch.vue')
  },

  data () {
    return {
      perPage: 9,
      numOfItems: 9,
      q: '',
      viewMode: null,
      albums: []
    }
  },

  computed: {
    displayedItems () {
      return limitBy(
        filterBy(this.albums, this.q, 'name', 'artist.name'),
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
      [event.$names.KOEL_READY]: () => (this.albums = albumStore.all),
      [event.$names.FILTER_CHANGED]: q => (this.q = q)
    })
  }
}
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
