<template>
  <li
    @dblclick.prevent="makeEditable"
    :class="['playlist', type, editing ? 'editing' : '', playlist.is_smart ? 'smart' : '']">
    <a :href="url"
      @dragleave="removeDroppableState"
      @dragenter.prevent="allowDrop"
      @dragover.prevent
      @drop.stop.prevent="handleDrop"
      :class="{ active: active }"
    >{{ playlist.name }}</a>

    <input type="text"
      @keyup.esc="cancelEdit"
      @keyup.enter="update"
      @blur="update"
      v-model="playlist.name"
      v-if="nameEditable && editing"
      v-koel-focus
      required
    >
  </li>
</template>

<script>
import { event, $ } from '@/utils'
import { songStore, playlistStore, favoriteStore } from '@/stores'

const VALID_PLAYLIST_TYPES = ['playlist', 'favorites', 'recently-played']

export default {
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

  data () {
    return {
      editing: false,
      active: false
    }
  },

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
    }
  },

  methods: {
    makeEditable () {
      if (!this.nameEditable) {
        return
      }

      this.beforeEditCache = this.playlist.name
      this.editing = true
    },

    update () {
      if (!this.nameEditable || !this.editing) {
        return
      }

      this.editing = false

      this.playlist.name = this.playlist.name.trim()
      if (!this.playlist.name) {
        this.playlist.name = this.beforeEditCache
        return
      }

      playlistStore.update(this.playlist)
    },

    cancelEdit () {
      this.editing = false
      this.playlist.name = this.beforeEditCache
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
    }
  },

  created () {
    event.on(event.$names.LOAD_MAIN_CONTENT, (view, playlist) => {
      switch (view) {
        case 'favorites':
        case 'recently-played':
          this.active = this.type === view
          break
        case 'playlist':
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
