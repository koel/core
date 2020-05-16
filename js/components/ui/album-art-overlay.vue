<template>
  <div :style="{ backgroundImage: albumCover ? `url(${albumCover})` : 'none' }"></div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { albumStore } from '@/stores'

export default Vue.extend({
  props: {
    album: {
      type: Object,
      require: true
    } as PropOptions<Album>
  },

  computed: {
    albumCover (): string | null {
      if (!this.album) {
        return null
      }

      return this.album.cover === albumStore.stub.cover ? null : this.album.cover
    }
  }
})
</script>

<style scoped>
div {
  position: fixed;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  filter: blur(20px);
  opacity: .07;
  z-index: 10000;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  transform: translateZ(0);
  will-change: filter;
  backface-visibility: hidden;
  pointer-events: none;
}
</style>
