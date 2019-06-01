<template>
  <div class="modal-wrapper" :class="{ overlay: this.showingModalName }">
    <create-smart-playlist-form v-if="showingModalName === 'create-smart-playlist-form'" @close="close"/>
    <edit-smart-playlist-form v-if="showingModalName === 'edit-smart-playlist-form'" @close="close" :playlist="boundData.playlist"/>
    <add-user-form v-if="showingModalName === 'add-user-form'" @close="close"/>
    <edit-user-form v-if="showingModalName === 'edit-user-form'" :user="boundData.user" @close="close"/>
    <edit-song-form v-if="showingModalName === 'edit-song-form'" :songs="boundData.songs" @close="close"/>
    <about-dialog v-if="showingModalName === 'about-dialog'" @close="close"/>
  </div>
</template>

<script>
import { event } from '@/utils'

export default {
  components: {
    CreateSmartPlaylistForm: () => import('@/components/playlist/smart-playlist/create-form.vue'),
    EditSmartPlaylistForm: () => import('@/components/playlist/smart-playlist/edit-form.vue'),
    AddUserForm: () => import('@/components/user/add-form.vue'),
    EditUserForm: () => import('@/components/user/edit-form.vue'),
    EditSongForm: () => import('@/components/song/edit-form.vue'),
    AboutDialog: () => import('@/components/meta/about-dialog.vue')
  },

  data: () => ({
    showingModalName: null,
    boundData: {}
  }),

  methods: {
    close () {
      this.showingModalName = null
      this.boundData = {}
    }
  },

  created () {
    event.on({
      [event.$names.MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM]: () => {
        this.showingModalName = 'create-smart-playlist-form'
      },

      [event.$names.MODAL_SHOW_EDIT_SMART_PLAYLIST_FORM]: playlist => {
        this.boundData.playlist = playlist
        this.showingModalName = 'edit-smart-playlist-form'
      },

      [event.$names.MODAL_SHOW_ADD_USER_FORM]: () => {
        this.showingModalName = 'add-user-form'
      },

      [event.$names.MODAL_SHOW_EDIT_USER_FORM]: user => {
        this.boundData.user = user
        this.showingModalName = 'edit-user-form'
      },

      [event.$names.MODAL_SHOW_EDIT_SONG_FORM]: songs => {
        this.boundData.songs = songs
        this.showingModalName = 'edit-song-form'
      },

      [event.$names.MODAL_SHOW_ABOUT_DIALOG]: () => {
        this.showingModalName = 'about-dialog'
      }
    })
  }
}
</script>
