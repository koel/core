<template>
  <div class="buttons song-list-controls">
    <button
      @click.prevent="shuffle"
      class="btn btn-orange btn-shuffle-all"
      title="Shuffle all"
      v-if="fullConfig.shuffle && selectedSongs.length < 2 && songs.length"
    >
      <i class="fa fa-random"></i> All
    </button>

    <button
      @click.prevent="shuffleSelected"
      class="btn btn-orange btn-shuffle-selected"
      title="Shuffle selected"
      v-if="fullConfig.shuffle && selectedSongs.length > 1"
    >
      <i class="fa fa-random"></i> Selected
    </button>

    <button
      :title="`${showingAddToMenu ? 'Cancel' : 'Add selected songs to…'}`"
      @click.prevent.stop="showingAddToMenu = !showingAddToMenu"
      class="btn btn-green btn-add-to"
      v-if="selectedSongs.length"
    >
      {{ showingAddToMenu ? 'Cancel' : 'Add To…' }}
    </button>

    <button
      @click.prevent="clearQueue"
      class="btn btn-red btn-clear-queue"
      v-if="showClearQueueButton"
      title="Clear current queue"
    >
      Clear
    </button>

    <button
      @click.prevent="deletePlaylist"
      class="del btn btn-red btn-delete-playlist"
      title="Delete this playlist"
      v-if="showDeletePlaylistButton"
    >
      <i class="fa fa-times"></i> Playlist
    </button>

    <add-to-menu
      :config="fullConfig.addTo"
      :songs="selectedSongs"
      :showing="showingAddToMenu"
      v-koel-clickaway="closeAddToMenu"
    />
  </div>
</template>

<script>
export default {
  props: {
    config: Object,
    songs: {
      type: Array,
      default: () => []
    },
    selectedSongs: {
      type: Array,
      default: () => []
    }
  },

  components: {
    addToMenu: () => import('./add-to-menu.vue')
  },

  data: () => ({
    fullConfig: {
      shuffle: true,
      addTo: {
        queue: true,
        favorites: true,
        playlists: true,
        newPlaylist: true
      },
      clearQueue: false,
      deletePlaylist: false
    },
    showingAddToMenu: false,
    numberOfQueuedSongs: 0
  }),

  computed: {
    showClearQueueButton () {
      return this.fullConfig.clearQueue
    },

    showDeletePlaylistButton () {
      return this.fullConfig.deletePlaylist
    }
  },

  created () {
    this.fullConfig = Object.assign(this.fullConfig, this.config)
  },

  methods: {
    shuffle () {
      this.$emit('shuffleAll')
    },

    shuffleSelected () {
      this.$emit('shuffleSelected')
    },

    clearQueue () {
      this.$emit('clearQueue')
    },

    deletePlaylist () {
      this.$emit('deletePlaylist')
    },

    closeAddToMenu () {
      this.showingAddToMenu = false
    }
  }
}
</script>
