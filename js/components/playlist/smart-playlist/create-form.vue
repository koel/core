<template>
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
            v-for="(group, index) in ruleGroups"
            :isFirstGroup="index === 0"
            :key="group.id"
            :group="group"
            @input="onGroupChanged"
          />
          <button @click.prevent="addGroup" class="btn-small"><i class="fa fa-plus"></i> GROUP</button>
        </div>
      </div>

      <footer>
        <button class="btn btn-green">Create</button>
        <button class="btn btn-white btn-cancel" @click.prevent="close">Cancel</button>
      </footer>
    </form>
  </div>
</template>

<script>
import { playlistStore } from '@/stores'
import router from '@/router'

export default {
  components: {
    RuleGroup: () => import('@/components/playlist/smart-playlist/rule-group.vue'),
    SoundBar: () => import('@/components/ui/sound-bar.vue')
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
      this.ruleGroups.push(this.createGroup())
    },

    onGroupChanged (data) {
      let changedGroup = this.ruleGroups.find(g => g.id === data.id)
      changedGroup = Object.assign(changedGroup, data)
      // Remove empty group
      if (changedGroup.rules.length === 0) {
        this.ruleGroups = this.ruleGroups.filter(group => group.id !== changedGroup.id)
      }
    },

    createGroup () {
      return {
        id: (new Date()).getTime(),
        rules: []
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
  }
}
</script>

<style lang="scss" scoped>
form {
  width: 480px;
}

.rules {
  background: #f2f2f2;
  padding: 12px;
  border-radius: 5px;

  input[type=text], input[type=number], input[type=datetime] {
    display: inline-block;
  }
}
</style>
