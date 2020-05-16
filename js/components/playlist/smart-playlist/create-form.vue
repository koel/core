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

<script lang="ts">
import Vue from 'vue'
import { playlistStore } from '@/stores'
import router from '@/router'

export default Vue.extend({
  components: {
    Btn: () => import('@/components/ui/btn.vue'),
    FormBase: () => import('@/components/playlist/smart-playlist/form-base.vue'),
    RuleGroup: () => import('@/components/playlist/smart-playlist/rule-group.vue'),
    SoundBar: () => import('@/components/ui/sound-bar.vue')
  },

  data: () => ({
    name: '',
    ruleGroups: [] as SmartPlaylistRuleGroup[],
    meta: {
      loading: false
    }
  }),

  methods: {
    addGroup (): void {
      this.ruleGroups.push(this.createGroup())
    },

    onGroupChanged (data: SmartPlaylistRuleGroup): void {
      const changedGroup = Object.assign(this.ruleGroups.find(g => g.id === data.id), data)

      // Remove empty group
      if (changedGroup.rules.length === 0) {
        this.ruleGroups = this.ruleGroups.filter(group => group.id !== changedGroup.id)
      }
    },

    close (): void {
      this.$emit('close')
    },

    async submit (): Promise<void> {
      this.meta.loading = true
      const playlist = await playlistStore.store(this.name, [], this.ruleGroups)
      this.meta.loading = false
      this.close()
      this.$nextTick(() => router.go(`playlist/${playlist.id}`))
    },

    createGroup: (): SmartPlaylistRuleGroup => playlistStore.createEmptySmartPlaylistRuleGroup()
  }
})
</script>
