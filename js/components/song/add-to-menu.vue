<template>
  <div class="add-to" v-show="showing" v-koel-clickaway="close">
    <p>Add {{ songs.length | pluralize('song') }} to</p>

    <ul>
      <template v-if="config.queue">
        <li class="after-current" @click="queueSongsAfterCurrent" role="button" tabindex="0">After Current Song</li>
        <li class="bottom-queue" @click="queueSongsToBottom" role="button" tabindex="0">Bottom of Queue</li>
        <li class="top-queue" @click="queueSongsToTop" role="button" tabindex="0">Top of Queue</li>
      </template>

      <li
        @click="addSongsToFavorite"
        class="favorites"
        role="button"
        tabindex="0"
        v-if="config.favorites"
      >
        Favorites
      </li>

      <template v-if="config.playlists">
        <li
          :key="playlist.id"
          @click="addSongsToExistingPlaylist(playlist)"
          class="playlist"
          role="button"
          tabindex="0"
          v-for="playlist in playlistState.playlists"
        >
          {{ playlist.name }}
        </li>
      </template>
    </ul>

    <template v-if="config.newPlaylist">
      <p>or create a new playlist</p>

      <form class="form-save form-simple form-new-playlist" @submit.prevent="createNewPlaylistFromSongs">
        <input
          @keyup.esc.prevent="close"
          required
          type="text"
          placeholder="Playlist name"
          v-model="newPlaylistName"
        >
        <btn type="submit" title="Save">⏎</btn>
      </form>
    </template>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { pluralize } from '@/utils'
import { playlistStore } from '@/stores'
import router from '@/router'
import songMenuMethods from '@/mixins/song-menu-methods.ts'

export default mixins(songMenuMethods).extend({
  components: {
    Btn: () => import('@/components/ui/btn.vue')
  },

  props: {
    showing: {
      type: Boolean,
      default: false
    },
    config: Object
  },

  filters: { pluralize },

  data: () => ({
    newPlaylistName: '',
    playlistState: playlistStore.state
  }),

  watch: {
    songs (): void {
      if (!this.songs.length) {
        this.close()
      }
    }
  },

  methods: {
    /**
     * Save the selected songs as a playlist.
     * As of current we don't have selective save.
     */
    async createNewPlaylistFromSongs (): Promise<void> {
      this.newPlaylistName = this.newPlaylistName.trim()

      if (!this.newPlaylistName) {
        return
      }

      const playlist = await playlistStore.store(this.newPlaylistName, this.songs)
      this.newPlaylistName = ''
      // Activate the new playlist right away
      this.$nextTick((): void => router.go(`playlist/${playlist.id}`))

      this.close()
    },

    close (): void {
      this.$emit('closing')
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.add-to {
  @include context-menu();

  width: 100%;
  max-width: 225px;
  position: absolute;
  padding: 8px;
  top: 39px;
  left: 0;

  p {
    margin: 4px 0;
    font-size: .9rem;

    &::first-of-type {
      margin-top: 0;
    }
  }

  $itemHeight: 28px;
  $itemMargin: 2px;

  ul {
    max-height: 5 * ($itemHeight + $itemMargin);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  li {
    height: $itemHeight;
    line-height: $itemHeight;
    padding: 0 8px;
    margin: $itemMargin 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 3px;
    background: lighten($colorMenuBgr, 8%);
    cursor: pointer;

    &:hover {
      background: $colorHighlight;
      color: #fff;
    }
  }

  &::before {
    display: block;
    content: " ";
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid $colorMenuBgr;
    position: absolute;
    top: -7px;
    left: calc(50% - 10px);
  }

  form {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    input[type="text"] {
      width: 100%;
      border-radius: 5px 0 0 5px;
      height: 28px;
    }

    button[type="submit"] {
      margin-top: 0;
      border-radius: 0 5px 5px 0 !important;
      height: 28px;
      line-height: 28px;
      padding-top: 0;
      padding-bottom: 0;
      margin-left: -2px !important;
    }
  }
}
</style>
