<template>
  <div class="rule-group">
    <div class="group-banner">
      <span v-if="isFirstGroup">Match songs with <strong>all</strong> of these criteria</span>
      <span v-else><strong>or</strong> <strong>all</strong> of these criteria</span>
    </div>

    <rule
      v-for="rule in mutatedGroup.rules"
      :key="rule.id"
      :rule="rule"
      @input="onRuleChanged"
      @remove="removeRule(rule)"
    />

    <button @click.prevent="addRule" class="btn-small"><i class="fa fa-plus"></i> RULE</button>
  </div>
</template>

<script>
import models from '@/config/smart-playlist/models'
import operators from '@/config/smart-playlist/operators'

export default {
  props: ['group', 'isFirstGroup'],

  components: {
    Rule: () => import('@/components/playlist/smart-playlist/rule.vue')
  },

  data: () => ({
    mutatedGroup: {}
  }),

  created () {
    this.mutatedGroup = JSON.parse(JSON.stringify(this.group))
  },

  methods: {
    onRuleChanged (data) {
      const changedRule = this.mutatedGroup.rules.find(r => r.id === data.id)
      Object.assign(changedRule, data)
      this.notifyParentForUpdate()
    },

    addRule () {
      this.mutatedGroup.rules.push(this.createRule())
    },

    createRule () {
      return {
        id: (new Date()).getTime(),
        model: models[0].name,
        operator: operators[0].operator,
        value: ['']
      }
    },

    removeRule (rule) {
      this.mutatedGroup.rules = this.mutatedGroup.rules.filter(r => r.id !== rule.id)
      this.notifyParentForUpdate()
    },

    notifyParentForUpdate () {
      this.$emit('input', this.mutatedGroup)
    }
  }
}
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
