<template>
  <section class="track-listing">
    <h1>Track Listing</h1>

    <ul class="tracks">
      <li
        :album="album"
        :key="idx"
        :index="idx"
        :track="track"
        is="track-list-item"
        v-for="(track, idx) in album.info.tracks"
      />
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    album: {
      type: Object,
      required: true
    }
  },

  components: {
    TrackListItem: () => import('./track-list-item.vue')
  }
}
</script>
