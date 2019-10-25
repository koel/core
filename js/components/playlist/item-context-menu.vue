<template>
  <base-context-menu extra-class="playlist-item-menu" ref="base">
    <li @click="editPlaylist">Edit</li>
    <li @click="deletePlaylist">Delete</li>
  </base-context-menu>
</template>

<script>
import { event } from '@/utils'

export default {
  components: {
    BaseContextMenu: () => import('@/components/ui/context-menu')
  },

  props: {
    playlist: {
      required: true,
      type: Object
    }
  },

  methods: {
    open (top, left) {
      this.$refs.base.open(top, left)
    },

    close () {
      this.$refs.base.close()
    },

    editPlaylist () {
      if (this.playlist.is_smart) {
        event.emit(event.$names.MODAL_SHOW_EDIT_SMART_PLAYLIST_FORM, this.playlist)
      } else {
        this.$emit('edit')
      }

      this.close()
    },

    deletePlaylist () {
      event.emit(event.$names.PLAYLIST_DELETE, this.playlist)
      this.close()
    }
  }
}
</script>

