<template>
  <section id="playlists">
    <h1>Playlists
      <i
        :class="{ creating }"
        @click="toggleContextMenu"
        class="fa fa-plus-circle control create"
        role="button"
        title="Create a new playlist"
      ></i>
    </h1>

    <form v-if="creating" @submit.prevent="createPlaylist" class="create">
      <input
        @keyup.esc.prevent="creating = false"
        placeholder="↵ to save"
        required
        type="text"
        v-koel-focus
        v-model="newName"
      >
    </form>

    <ul>
      <playlist-item type="favorites" :playlist="{ name: 'Favorites', songs: favoriteState.songs }"/>
      <playlist-item type="recently-played" :playlist="{ name: 'Recently Played', songs: [] }"/>
      <playlist-item
        :playlist="playlist"
        :key="playlist.id"
        type="playlist"
        v-for="playlist in playlistState.playlists"
      />
    </ul>

    <context-menu ref="contextMenu" @createPlaylist="creating = true"/>
  </section>
</template>

<script>
import { playlistStore, favoriteStore, recentlyPlayedStore } from '@/stores'
import router from '@/router'

export default {
  components: {
    PlaylistItem: () => import('@/components/playlist/sidebar-item.vue'),
    ContextMenu: () => import('@/components/playlist/create-new-context-menu.vue')
  },

  data: () => ({
    playlistState: playlistStore.state,
    favoriteState: favoriteStore.state,
    recentlyPlayedState: recentlyPlayedStore.state,
    creating: false,
    newName: ''
  }),

  methods: {
    async createPlaylist () {
      this.creating = false

      const playlist = await playlistStore.store(this.newName)
      this.newName = ''
      // Activate the new playlist right away
      this.$nextTick(() => router.go(`playlist/${playlist.id}`))
    },

    toggleContextMenu (event) {
      this.$nextTick(() => {
        if (this.creating) {
          this.creating = false
        } else {
          this.$refs.contextMenu.open(event.pageY, event.pageX)
        }
      })
    }
  }
}
</script>

<style lang="scss">
#playlists {
  .control.create {
    margin-top: 2px;
    font-size: 16px;
    transition: .3s;

    &.creating {
      transform: rotate(135deg);
    }
  }

  form.create {
    padding: 8px 16px;

    input[type="text"] {
      width: 100%;
    }
  }
}
</style>
