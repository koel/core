<template>
  <div class="modal-wrapper" :class="{ overlay: showingModalName }">
    <create-smart-playlist-form v-if="showingModalName === 'create-smart-playlist-form'" @close="close"/>
    <edit-smart-playlist-form v-if="showingModalName === 'edit-smart-playlist-form'" @close="close" :playlist="boundData.playlist"/>
    <add-user-form v-if="showingModalName === 'add-user-form'" @close="close"/>
    <edit-user-form v-if="showingModalName === 'edit-user-form'" :user="boundData.user" @close="close"/>
    <edit-song-form
      :songs="boundData.songs"
      :initialTab="boundData.initialTab"
      @close="close"
      v-if="showingModalName === 'edit-song-form'"
    />
    <about-dialog v-if="showingModalName === 'about-dialog'" @close="close"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { event } from '@/utils'

interface ModalWrapperBoundData {
  playlist?: Playlist
  user?: User
  songs?: Song[]
  initialTab?: string
}

export default Vue.extend({
  components: {
    CreateSmartPlaylistForm: () => import('@/components/playlist/smart-playlist/create-form.vue'),
    EditSmartPlaylistForm: () => import('@/components/playlist/smart-playlist/edit-form.vue'),
    AddUserForm: () => import('@/components/user/add-form.vue'),
    EditUserForm: () => import('@/components/user/edit-form.vue'),
    EditSongForm: () => import('@/components/song/edit-form.vue'),
    AboutDialog: () => import('@/components/meta/about-dialog.vue')
  },

  data: () => ({
    showingModalName: '',
    boundData: {} as ModalWrapperBoundData
  }),

  methods: {
    close () {
      this.showingModalName = ''
      this.boundData = {}
    }
  },

  created () {
    event.on({
      [event.$names.MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM]: (): void => {
        this.showingModalName = 'create-smart-playlist-form'
      },

      [event.$names.MODAL_SHOW_EDIT_SMART_PLAYLIST_FORM]: (playlist: Playlist): void => {
        this.boundData.playlist = playlist
        this.showingModalName = 'edit-smart-playlist-form'
      },

      [event.$names.MODAL_SHOW_ADD_USER_FORM]: (): void => {
        this.showingModalName = 'add-user-form'
      },

      [event.$names.MODAL_SHOW_EDIT_USER_FORM]: (user: User): void => {
        this.boundData.user = user
        this.showingModalName = 'edit-user-form'
      },

      [event.$names.MODAL_SHOW_EDIT_SONG_FORM]: (songs: Song[], initialTab: string = 'details'): void => {
        this.boundData.songs = songs
        this.boundData.initialTab = initialTab
        this.showingModalName = 'edit-song-form'
      },

      [event.$names.MODAL_SHOW_ABOUT_DIALOG]: (): void => {
        this.showingModalName = 'about-dialog'
      }
    })
  }
})
</script>
