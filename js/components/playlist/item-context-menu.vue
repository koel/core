<template>
  <base-context-menu extra-class="playlist-item-menu" ref="base">
    <li @click="editPlaylist">Edit</li>
    <li @click="deletePlaylist">Delete</li>
  </base-context-menu>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { event } from '@/utils'

interface PlaylistMenuBaseRef extends Vue {
  open(top: number, left: number): void
  close(): void
}

export default Vue.extend({
  components: {
    BaseContextMenu: () => import('@/components/ui/context-menu.vue')
  },

  props: {
    playlist: {
      required: true,
      type: Object
    } as PropOptions<Playlist>
  },

  methods: {
    open (top: number, left: number): void {
      (this.$refs.base as PlaylistMenuBaseRef).open(top, left)
    },

    close (): void {
      (this.$refs.base as PlaylistMenuBaseRef).close()
    },

    editPlaylist (): void {
      if (this.playlist.is_smart) {
        event.emit(event.$names.MODAL_SHOW_EDIT_SMART_PLAYLIST_FORM, this.playlist)
      } else {
        this.$emit('edit')
      }

      this.close()
    },

    deletePlaylist (): void {
      event.emit(event.$names.PLAYLIST_DELETE, this.playlist)
      this.close()
    }
  }
})
</script>

