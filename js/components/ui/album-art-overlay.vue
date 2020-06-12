<template>
  <div :style="{ backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'none' }"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import { albumStore, preferenceStore } from '@/stores'
import { eventBus } from '@/utils'
import { events } from '@/config'

export default Vue.extend({
  data: () => ({
    thumbnailUrl: null as string | null
  }),

  created (): void {
    eventBus.on(events.SONG_STARTED, async (song: Song): Promise<void> => {
      if (preferenceStore.state.showAlbumArtOverlay) {
        this.thumbnailUrl = await albumStore.getThumbnail(song.album)
      }
    })
  }
})
</script>

<style scoped>
div {
  position: fixed;
  opacity: .07;
  z-index: 10000;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
