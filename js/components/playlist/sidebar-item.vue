<template>
  <li
    @dblclick.prevent="makeEditable"
    :class="['playlist', type, editing ? 'editing' : '', playlist.is_smart ? 'smart' : '']">
    <a
      :class="{ active }"
      :href="url"
      @contextmenu.prevent="openContextMenu"
      @dragenter.prevent="allowDrop"
      @dragleave="removeDroppableState"
      @dragover.prevent
      @drop.stop.prevent="handleDrop"
    >{{ playlist.name }}</a>

    <name-editor
      :playlist="playlist"
      @cancelled="cancelEditing"
      @updated="onPlaylistNameUpdated"
      v-if="nameEditable && editing"
    />

    <context-menu :playlist="playlist" ref="contextMenu" @edit="makeEditable" />
  </li>
</template>

<script>
import { $, event } from '@/utils'
import router from '@/router'
import { songStore, playlistStore, favoriteStore } from '@/stores'
import { views } from '@/config'

const VALID_PLAYLIST_TYPES = ['playlist', 'favorites', 'recently-played']

export default {
  components: {
    ContextMenu: () => import('@/components/playlist/item-context-menu'),
    NameEditor: () => import('@/components/playlist/name-editor')
  },

  props: {
    playlist: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'playlist',
      validator: value => VALID_PLAYLIST_TYPES.includes(value)
    }
  },

  data: () => ({
    editing: false,
    active: false
  }),

  computed: {
    url () {
      switch (this.type) {
        case 'playlist':
          return `#!/playlist/${this.playlist.id}`
        case 'favorites':
          return '#!/favorites'
        case 'recently-played':
          return '#!/recently-played'
        default:
          throw Error('Invalid playlist type')
      }
    },

    nameEditable () {
      return this.type === 'playlist'
    },

    contentEditable () {
      if (this.playlist.is_smart) {
        return false
      }

      return this.type === 'playlist' || this.type === 'favorites'
    },

    hasContextMenu () {
      return this.type === 'playlist'
    }
  },

  methods: {
    makeEditable () {
      if (!this.nameEditable) {
        return
      }

      this.editing = true
    },

    /**
     * Remove the droppable state when a dragleave event occurs on the playlist's DOM element.
     *
     * @param {Object} e The dragleave event.
     */
    removeDroppableState (e) {
      if (this.contentEditable) {
        $.removeClass(e.target, 'droppable')
      }
    },

    /**
     * Add a "droppable" class and set the drop effect when an item is dragged over the playlist's
     * DOM element.
     *
     * @param {Object} e The dragover event.
     */
    allowDrop (e) {
      if (this.contentEditable) {
        $.addClass(e.target, 'droppable')
        e.dataTransfer.dropEffect = 'move'
      }

      return false
    },

    /**
     * Handle songs dropped to our favorite or playlist menu item.
     *
     * @param  {Object}   e    The event
     *
     * @return {Boolean}
     */
    handleDrop (e) {
      if (!this.contentEditable) {
        return false
      }

      this.removeDroppableState(e)

      if (!e.dataTransfer.getData('application/x-koel.text+plain')) {
        return false
      }

      const songs = songStore.byIds(e.dataTransfer.getData('application/x-koel.text+plain').split(','))

      if (!songs.length) {
        return false
      }

      if (this.type === 'favorites') {
        favoriteStore.like(songs)
      } else if (this.type === 'playlist') {
        playlistStore.addSongs(this.playlist, songs)
      }

      return false
    },

    openContextMenu (event) {
      if (this.hasContextMenu) {
        router.go(`/playlist/${this.playlist.id}`)
        this.$refs.contextMenu.open(event.pageY, event.pageX)
      }
    },

    cancelEditing () {
      this.editing = false
    },

    onPlaylistNameUpdated (mutatedPlaylist) {
      this.playlist.name = mutatedPlaylist.name
      this.editing = false
    }
  },

  created () {
    event.on(event.$names.LOAD_MAIN_CONTENT, (view, playlist) => {
      switch (view) {
        case views.FAVORITES:
          this.active = this.type === 'favorites'
          break
        case views.RECENTLY_PLAYED:
          this.active = this.type === 'recently-played'
          break
        case views.PLAYLIST:
          this.active = this.playlist === playlist
          break
        default:
          this.active = false
          break
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

.playlist {
  user-select: none;

  a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    span {
      pointer-events: none;
    }

    &::before {
      content: "\f0f6";
    }
  }

  &.favorites a::before {
    content: "\f004";
    color: $colorHeart;
  }

  &.recently-played a::before {
    content: "\f1da";
    color: $colorGreen;
  }

  &.smart a::before {
    content: "\f069";
  }

  input {
    width: calc(100% - 32px);
    margin: 5px 16px;
  }

  &.editing {
    a {
      display: none !important;
    }
  }
}
</style>
