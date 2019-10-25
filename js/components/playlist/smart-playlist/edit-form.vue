<template>
  <form-base>
    <div class="create-smart-playlist">
      <sound-bar v-if="meta.loading"/>
      <form @submit.prevent="submit" v-else>
        <header>
          <h1>Edit Smart Playlist</h1>
        </header>

        <div>
          <div class="form-row">
            <label>Name</label>
            <input type="text" v-model="mutatedPlaylist.name" required>
          </div>

          <div class="form-row rules">
            <rule-group
              v-for="(group, index) in playlist.rules"
              :isFirstGroup="index === 0"
              :key="group.id"
              :group="group"
              @input="onGroupChanged"
            />
            <a @click.prevent="addGroup" class="btn btn-small"><i class="fa fa-plus"></i> GROUP</a>
          </div>
        </div>

        <footer>
          <button class="btn-green" type="submit">Save</button>
          <button class="btn-white btn-cancel" @click.prevent="close">Cancel</button>
        </footer>
      </form>
    </div>
  </form-base>
</template>

<script>
import { playlistStore } from '@/stores'

export default {
  components: {
    FormBase: () => import('./form-base'),
    RuleGroup: () => import('@/components/playlist/smart-playlist/rule-group'),
    SoundBar: () => import('@/components/ui/sound-bar')
  },

  props: {
    playlist: {
      required: true,
      type: Object
    }
  },

  data: () => ({
    meta: {
      loading: false
    },
    mutatedPlaylist: {}
  }),

  methods: {
    addGroup () {
      this.mutatedPlaylist.rules.push(this.$options.createGroup())
    },

    onGroupChanged (data) {
      let changedGroup = this.mutatedPlaylist.rules.find(g => g.id === data.id)
      changedGroup = Object.assign(changedGroup, data)
      // Remove empty group
      if (changedGroup.rules.length === 0) {
        this.mutatedPlaylist.rules = this.mutatedPlaylist.rules.filter(group => group.id !== changedGroup.id)
      }
    },

    close () {
      this.$emit('close')
    },

    async submit () {
      this.meta.loading = true
      await playlistStore.update(this.mutatedPlaylist)
      Object.assign(this.playlist, this.mutatedPlaylist)
      this.meta.loading = false
      this.close()
      await playlistStore.fetchSongs(this.playlist)
    }
  },

  created () {
    Object.assign(this.mutatedPlaylist, this.playlist)
  },

  createGroup: () => ({
    id: (new Date()).getTime(),
    rules: []
  })
}
</script>
