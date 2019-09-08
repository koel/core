<template>
  <input type="text"
    @keyup.esc="cancel"
    @keyup.enter="update"
    @blur="update"
    v-model="mutatedPlaylist.name"
    v-koel-focus
    required
  >
</template>

<script>
import { playlistStore } from '@/stores'

export default {
  props: {
    playlist: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    mutatedPlaylist: null,
    updating: false
  }),

  methods: {
    async update () {
      this.mutatedPlaylist.name = this.mutatedPlaylist.name.trim()

      if (!this.mutatedPlaylist.name) {
        this.cancel()
        return
      }

      if (this.mutatedPlaylist.name === this.playlist.name) {
        this.cancel()
        return
      }

      // prevent duplicate updating from Enter and Blur
      if (this.updating) {
        return
      }

      this.updating = true

      await playlistStore.update(this.mutatedPlaylist)
      this.$emit('updated', this.mutatedPlaylist)
    },

    cancel () {
      this.$emit('cancelled')
    }
  },

  created () {
    this.mutatedPlaylist = Object.assign({}, this.playlist)
  }
}
</script>
