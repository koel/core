<template>
  <div class="modal-wrapper" :class="{ overlay: this.showingModalName }">
    <create-smart-playlist-form v-if="showingModalName === 'create-smart-playlist-form'" @close="close"/>
    <add-user-form v-if="showingModalName === 'add-user-form'" @close="close"/>
    <edit-user-form v-if="showingModalName === 'edit-user-form'" :user="boundData.user" @close="close"/>
    <edit-song-form v-if="showingModalName === 'edit-song-form'" :songs="boundData.songs" @close="close"/>
  </div>
</template>

<script>
import { event } from '@/utils'

export default {
  components: {
    CreateSmartPlaylistForm: () => import('@/components/playlist/smart-playlist/create-form.vue'),
    AddUserForm: () => import('@/components/user/add-form.vue'),
    EditUserForm: () => import('@/components/user/edit-form.vue'),
    EditSongForm: () => import('@/components/song/edit-form.vue')
  },

  data: () => ({
    showingModalName: null,
    boundData: {}
  }),

  methods: {
    close () {
      this.showingModalName = null
    }
  },

  created () {
    event.on({
      [event.$names.MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM]: () => {
        this.showingModalName = 'create-smart-playlist-form'
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
      }
    })
  }
}
</script>
