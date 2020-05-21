<template>
  <tr
    class="song-item"
    draggable="true"
    @click="clicked"
    @dblclick.prevent="playRightAwayyyyyyy"
    @dragstart="dragStart"
    @dragleave="dragLeave"
    @dragenter.prevent="dragEnter"
    @dragover.prevent
    @drop.stop.prevent="drop"
    @contextmenu.prevent="contextMenu"
    :class="{ playing, selected: item.selected }"
  >
    <td class="track-number">{{ song.track || '' }}</td>
    <td class="title">{{ song.title }}</td>
    <td class="artist">{{ song.artist.name }}</td>
    <td class="album">{{ song.album.name }}</td>
    <td class="time">{{ song.fmtLength }}</td>
    <td class="play" @click.stop="doPlayback">
      <i class="fa fa-pause-circle" v-if="song.playbackState === 'Playing'"></i>
      <i class="fa fa-play-circle" v-else></i>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import $, { VueQuery } from 'vuequery'
import { playback } from '@/services'
import { queueStore } from '@/stores'
import { SongListComponent } from 'koel/types/ui'

export default Vue.extend({
  name: 'song-item',
  props: {
    item: {
      type: Object,
      required: true
    } as PropOptions<SongProxy>
  },

  computed: {
    /**
     * A shortcut to access the current vm's song (instead of this.item.song).
     */
    song (): Song {
      return this.item.song
    },

    playing (): boolean {
      return this.song.playbackState === 'Playing' || this.song.playbackState === 'Paused'
    },

    parentSongList (): SongListComponent {
      return ($(this) as VueQuery).closest('song-list')!.vm as unknown as SongListComponent
    }
  },

  methods: {
    playRightAwayyyyyyy (): void {
      if (!queueStore.contains(this.song)) {
        queueStore.queueAfterCurrent(this.song)
      }

      playback.play(this.song)
    },

    doPlayback (): void {
      switch (this.song.playbackState) {
        case 'Playing':
          playback.pause()
          break

        case 'Paused':
          playback.resume()
          break

        default:
          this.playRightAwayyyyyyy()
          break
      }
    },

    clicked (event: MouseEvent): void {
      this.parentSongList.rowClicked(this, event)
    },

    dragStart (event: DragEvent): void {
      this.parentSongList.dragStart(this, event)
    },

    dragLeave (event: DragEvent): void {
      this.parentSongList.removeDroppableState(event)
    },

    dragEnter (event: DragEvent): void {
      this.parentSongList.allowDrop(event)
    },

    drop (event: DragEvent): void {
      this.parentSongList.handleDrop(this, event)
    },

    contextMenu (event: MouseEvent): void {
      this.parentSongList.openContextMenu(this, event)
    }
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

.song-item {
  border-bottom: 1px solid $color2ndBgr;
  max-width: 100% !important; // overriding .item
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
