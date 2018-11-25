<template>
  <base-context-menu extra-class="song-menu" ref="base">
    <template>
      <template v-show="onlyOneSongSelected">
        <li class="playback" @click.stop.prevent="doPlayback">
          <span v-if="firstSongPlaying">Pause</span>
          <span v-else>Play</span>
        </li>
        <li class="go-to-album" @click="viewAlbumDetails(songs[0].album)">Go to Album</li>
        <li class="go-to-artist" @click="viewArtistDetails(songs[0].artist)">Go to Artist</li>
      </template>
      <li class="has-sub">Add To
        <ul class="menu submenu menu-add-to">
          <li class="after-current" @click="queueSongsAfterCurrent">After Current Song</li>
          <li class="bottom-queue" @click="queueSongsToBottom">Bottom of Queue</li>
          <li class="top-queue" @click="queueSongsToTop">Top of Queue</li>
          <li class="separator"></li>
          <li class="favorite" @click="addSongsToFavorite">Favorites</li>
          <li class="separator" v-if="normalPlaylists.length"></li>
          <li
            class="playlist"
            v-for="p in normalPlaylists"
            :key="p.id"
            @click="addSongsToExistingPlaylist(p)">{{ p.name }}</li>
        </ul>
      </li>
      <li class="open-edit-form" v-if="isAdmin" @click="openEditForm">Edit</li>
      <li class="download" v-if="sharedState.allowDownload" @click="download">Download</li>
      <li class="copy-url" v-if="copyable && onlyOneSongSelected" @click="copyUrl">Copy Shareable URL</li>
    </template>
  </base-context-menu>
</template>

<script>
import songMenuMethods from '@/mixins/song-menu-methods'
import { event, isClipboardSupported, copyText } from '@/utils'
import { sharedStore, songStore, queueStore, userStore, playlistStore } from '@/stores'
import { playback, download } from '@/services'
import router from '@/router'

export default {
  props: {
    songs: {
      type: Array,
      required: true
    }
  },
  mixins: [songMenuMethods],

  components: {
    BaseContextMenu: () => import('@/components/ui/context-menu.vue')
  },

  data () {
    return {
      playlistState: playlistStore.state,
      sharedState: sharedStore.state,
      copyable: isClipboardSupported
    }
  },

  computed: {
    onlyOneSongSelected () {
      return this.songs.length === 1
    },

    firstSongPlaying () {
      return this.songs[0] ? this.songs[0].playbackState === 'playing' : false
    },

    normalPlaylists () {
      return this.playlistState.playlists.filter(playlist => !playlist.is_smart)
    },

    isAdmin: () => userStore.current.is_admin
  },

  methods: {
    open (top, left) {
      if (!this.songs.length) {
        return
      }

      this.$refs.base.open(top, left)
    },

    close () {
      this.$refs.base.close()
    },

    doPlayback () {
      switch (this.songs[0].playbackState) {
        case 'playing':
          playback.pause()
          break
        case 'paused':
          playback.resume()
          break
        default:
          queueStore.contains(this.songs[0]) || queueStore.queueAfterCurrent(this.songs[0])
          playback.play(this.songs[0])
          break
      }
      this.close()
    },

    openEditForm () {
      this.songs.length && event.emit(event.$names.MODAL_SHOW_EDIT_SONG_FORM, this.songs)
      this.close()
    },

    viewAlbumDetails (album) {
      router.go(`album/${album.id}`)
      this.close()
    },

    viewArtistDetails (artist) {
      router.go(`artist/${artist.id}`)
      this.close()
    },

    download () {
      download.fromSongs(this.songs)
      this.close()
    },

    copyUrl () {
      copyText(songStore.getShareableUrl(this.songs[0]))
      this.close()
    }
  }
}
</script>
