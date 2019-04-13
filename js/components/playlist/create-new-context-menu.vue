<template>
  <base-context-menu extra-class="playlist-menu" ref="base">
    <li @click="createPlaylist">New Playlist</li>
    <li @click="createSmartPlaylist">New Smart Playlist</li>
  </base-context-menu>
</template>

<script>
import { event } from '@/utils'

export default {
  components: {
    BaseContextMenu: () => import('@/components/ui/context-menu.vue')
  },

  methods: {
    open (top, left) {
      this.$refs.base.open(top, left)
    },

    close () {
      this.$refs.base.close()
    },

    createPlaylist () {
      this.$emit('createPlaylist')
      this.close()
    },

    createSmartPlaylist () {
      event.emit(event.$names.MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM)
      this.close()
    }
  }
}
</script>

