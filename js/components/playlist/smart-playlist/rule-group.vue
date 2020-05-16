<template>
  <div class="rule-group">
    <div class="group-banner">
      <span v-if="isFirstGroup">Include songs that match <strong>all</strong> of these criteria</span>
      <span v-else><strong>or</strong> <strong>all</strong> of these criteria</span>
    </div>

    <rule
      :key="rule.id"
      :rule="rule"
      @input="onRuleChanged"
      @remove="removeRule(rule)"
      v-for="rule in mutatedGroup.rules"
    />

    <btn @click.prevent="addRule" green small><i class="fa fa-plus"></i> RULE</btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { playlistStore } from '@/stores'

export default Vue.extend({
  props: ['group', 'isFirstGroup'],

  components: {
    Btn: () => import('@/components/ui/btn.vue'),
    Rule: () => import('@/components/playlist/smart-playlist/rule.vue')
  },

  data: () => ({
    mutatedGroup: null as unknown as SmartPlaylistRuleGroup
  }),

  created (): void {
    this.mutatedGroup = JSON.parse(JSON.stringify(this.group))
  },

  methods: {
    onRuleChanged (data: SmartPlaylistRule): void {
      Object.assign(this.mutatedGroup.rules.find(r => r.id === data.id), data)
      this.notifyParentForUpdate()
    },

    addRule (): void {
      this.mutatedGroup.rules.push(this.createRule())
    },

    removeRule (rule: SmartPlaylistRule): void {
      this.mutatedGroup.rules = this.mutatedGroup.rules.filter(r => r.id !== rule.id)
      this.notifyParentForUpdate()
    },

    notifyParentForUpdate (): void {
      this.$emit('input', this.mutatedGroup)
    },

    createRule: (): SmartPlaylistRule => playlistStore.createEmptySmartPlaylistRule()
  }
})
</script>

<style lang="scss" scoped>
.rule-group {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
}

.group-banner {
  margin-bottom: 16px;
}
</style>
