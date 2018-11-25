<template>
  <section id="playlists" @contextmenu.prevent="openContextMenu">
    <h1>Playlists
      <i class="fa fa-plus-circle control create" :class="{ creating: creating }" @click="creating = !creating"></i>
    </h1>

    <form v-if="creating" @submit.prevent="createPlaylist" class="create">
      <input type="text"
        @keyup.esc.prevent="creating = false"
        v-model="newName"
        v-koel-focus
        placeholder="↵ to save"
        required
      >
    </form>

    <ul>
      <playlist-item type="favorites" :playlist="{ name: 'Favorites', songs: favoriteState.songs }"/>
      <playlist-item type="recently-played" :playlist="{ name: 'Recently Played', songs: [] }"/>

      <playlist-item
        v-for="playlist in playlistState.playlists"
        type="playlist"
        :playlist="playlist"
        :key="playlist.id"/>
    </ul>

    <context-menu ref="contextMenu" @createPlaylist="creating = true"/>
  </section>
</template>

<script>
import { playlistStore, favoriteStore, recentlyPlayedStore } from '@/stores'
import router from '@/router'

export default {
  components: {
    PlaylistItem: () => import('@/components/playlist/item.vue'),
    ContextMenu: () => import('@/components/playlist/context-menu.vue')
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

    openContextMenu (event) {
      this.$nextTick(() => this.$refs.contextMenu.open(event.pageY, event.pageX))
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
