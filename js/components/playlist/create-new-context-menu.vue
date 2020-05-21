<template>
  <base-context-menu extra-class="playlist-menu" ref="base">
    <li @click="createPlaylist">New Playlist</li>
    <li @click="createSmartPlaylist">New Smart Playlist</li>
  </base-context-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { BasePlaylistMenu } from 'koel/types/ui'
import { eventBus } from '@/utils'
import { events } from '@/config'

export default Vue.extend({
  components: {
    BaseContextMenu: () => import('@/components/ui/context-menu.vue')
  },

  methods: {
    open (top: number, left: number): void {
      (this.$refs.base as BasePlaylistMenu).open(top, left)
    },

    close (): void {
      (this.$refs.base as BasePlaylistMenu).close()
    },

    createPlaylist (): void {
      this.$emit('createPlaylist')
      this.close()
    },

    createSmartPlaylist (): void {
      eventBus.emit(events.MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM)
      this.close()
    }
  }
})
</script>
