<template>
  <form-base>
    <template slot="default">
      <div class="create-smart-playlist">
        <sound-bar v-if="meta.loading"/>
        <form @submit.prevent="submit" v-else>
          <header>
            <h1>New Smart Playlist</h1>
          </header>

          <div>
            <div class="form-row">
              <label>Name</label>
              <input type="text" v-model="name" required>
            </div>

            <div class="form-row rules">
              <rule-group
                :group="group"
                :isFirstGroup="index === 0"
                :key="group.id"
                @input="onGroupChanged"
                v-for="(group, index) in ruleGroups"
              />
              <btn @click.prevent="addGroup" green small><i class="fa fa-plus"></i> GROUP</btn>
            </div>
          </div>

          <footer>
            <btn type="submit">Save</btn>
            <btn class="btn-cancel" @click.prevent="close" white>Cancel</btn>
          </footer>
        </form>
      </div>
    </template>
  </form-base>
</template>

<script>
import { playlistStore } from '@/stores'
import router from '@/router'

export default {
  components: {
    Btn: () => import('@/components/ui/btn'),
    FormBase: () => import('./form-base'),
    RuleGroup: () => import('@/components/playlist/smart-playlist/rule-group'),
    SoundBar: () => import('@/components/ui/sound-bar')
  },

  data: () => ({
    name: '',
    ruleGroups: [],
    meta: {
      loading: false
    }
  }),

  methods: {
    addGroup () {
      this.ruleGroups.push(this.$options.createGroup())
    },

    onGroupChanged (data) {
      let changedGroup = this.ruleGroups.find(g => g.id === data.id)
      changedGroup = Object.assign(changedGroup, data)
      // Remove empty group
      if (changedGroup.rules.length === 0) {
        this.ruleGroups = this.ruleGroups.filter(group => group.id !== changedGroup.id)
      }
    },

    close () {
      this.$emit('close')
    },

    async submit () {
      this.meta.loading = true
      const playlist = await playlistStore.store(this.name, [], this.ruleGroups)
      this.meta.loading = false
      this.close()
      this.$nextTick(() => router.go(`playlist/${playlist.id}`))
    }
  },

  createGroup: () => ({
    id: (new Date()).getTime(),
    rules: []
  })
}
</script>
