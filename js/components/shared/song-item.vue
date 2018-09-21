<template>
  <tr
    class="song-item"
    draggable="true"
    :data-song-id="song.id"
    @click="clicked"
    @dblclick.prevent="playRightAwayyyyyyy"
    @dragstart="dragStart"
    @dragleave="dragLeave"
    @dragenter.prevent="dragEnter"
    @dragover.prevent
    @drop.stop.prevent="drop"
    @contextmenu.prevent="contextMenu"
    :class="{ selected: item.selected, playing: playing }"
  >
    <td class="track-number">{{ song.track || '' }}</td>
    <td class="title">{{ song.title }}</td>
    <td class="artist">{{ song.artist.name }}</td>
    <td class="album">{{ song.album.name }}</td>
    <td class="time">{{ song.fmtLength }}</td>
    <td class="play" @click.stop="doPlayback">
      <i class="fa fa-pause-circle" v-if="song.playbackState === 'playing'"></i>
      <i class="fa fa-play-circle" v-else></i>
    </td>
  </tr>
</template>

<script>
import { playback } from '@/services'
import { queueStore } from '@/stores'
import $ from 'vuequery'

export default {
  name: 'song-item',
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      parentSongList: null
    }
  },

  computed: {
    /**
     * A shortcut to access the current vm's song (instead of this.item.song).
     * @return {Object}
     */
    song () {
      return this.item.song
    },

    playing () {
      return this.song.playbackState === 'playing' || this.song.playbackState === 'paused'
    }
  },

  mounted () {
    this.parentSongList = window.__UNIT_TESTING__ || $(this).closest('song-list').vm
  },

  methods: {
    playRightAwayyyyyyy () {
      queueStore.contains(this.song) || queueStore.queueAfterCurrent(this.song)
      playback.play(this.song)
    },

    doPlayback () {
      switch (this.song.playbackState) {
        case 'playing':
          playback.pause()
          break
        case 'paused':
          playback.resume()
          break
        default:
          this.playRightAwayyyyyyy()
          break
      }
    },

    clicked (event) {
      this.parentSongList.rowClicked(this, event)
    },

    dragStart (event) {
      this.parentSongList.dragStart(this, event)
    },

    dragLeave (event) {
      this.parentSongList.removeDroppableState(event)
    },

    dragEnter (event) {
      this.parentSongList.allowDrop(event)
    },

    drop (event) {
      this.parentSongList.handleDrop(this, event)
    },

    contextMenu (event) {
      this.parentSongList.openContextMenu(this, event)
    }
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

.song-item {
  border-bottom: 1px solid $color2ndBgr;
  height: 35px;

  html.no-touchevents &:hover {
    background: rgba(255, 255, 255, .05);
  }

  .time, .track-number {
    color: $color2ndText;
  }

  .title {
    min-width: 192px;
  }

  .play {
    max-width: 32px;
    opacity: .5;

    i {
      font-size: 1.5rem;
    }
  }

  &.selected {
    background-color: rgba(255, 255, 255, .08);
  }

  &.playing td {
    color: $colorHighlight;
  }
}
</style>
