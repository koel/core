<template>
  <base-context-menu extra-class="playlist-menu" ref="base">
    <li @click="createPlaylist">New Playlist</li>
    <li @click="createSmartPlaylist">New Smart Playlist</li>
  </base-context-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { event } from '@/utils'

interface PlaylistMenuBaseRef extends Vue {
  open(top: number, left: number): void
  close(): void
}

export default Vue.extend({
  components: {
    BaseContextMenu: () => import('@/components/ui/context-menu.vue')
  },

  methods: {
    open (top: number, left: number): void {
      (this.$refs.base as PlaylistMenuBaseRef).open(top, left)
    },

    close (): void {
      (this.$refs.base as PlaylistMenuBaseRef).close()
    },

    createPlaylist (): void {
      this.$emit('createPlaylist')
      this.close()
    },

    createSmartPlaylist (): void {
      event.emit(event.$names.MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM)
      this.close()
    }
  }
})
</script>

