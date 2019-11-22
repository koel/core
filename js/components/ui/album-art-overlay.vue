<template>
  <div :style="{ backgroundImage: albumCover ? `url(${albumCover})` : 'none' }"></div>
</template>

<script>
import { albumStore } from '@/stores/album'

export default {
  props: {
    album: {
      type: Object,
      require: true
    }
  },

  computed: {
    albumCover () {
      if (!this.album) {
        return null
      }

      return this.album.cover === albumStore.stub.cover ? null : this.album.cover
    }
  }
}
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
