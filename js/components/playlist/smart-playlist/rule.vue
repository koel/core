<template>
  <div class="row">
    <a class="btn btn-red" @click.prevent="removeRule"><i class="fa fa-times"></i></a>

    <select v-model="selectedModel">
      <option v-for="model in models" :key="model.name" :value="model">{{ model.label }}</option>
    </select>

    <select v-model="selectedOperator">
      <option v-for="option in options" :value="option" :key="option.operator">{{ option.label }}</option>
    </select>

    <rule-input
      v-for="input in availableInputs"
      :key="input.id"
      :type="selectedOperator.type || selectedModel.type"
      v-model="input.value"
      @input="onInput"
    />

    <span class="suffix">{{ selectedOperator.unit || selectedModel.unit }}</span>
  </div>
</template>

<script>
import models from '@/config/smart-playlist/models'
import types from '@/config/smart-playlist/types'

export default {
  components: {
    RuleInput: () => import('@/components/playlist/smart-playlist/rule-input.vue')
  },

  props: ['rule'],

  data: () => ({
    models,
    selectedModel: null,
    selectedOperator: null,
    inputValues: [],
    mutatedRule: {}
  }),

  watch: {
    options () {
      if (this.selectedModel === this.mutatedRule.model) {
        this.selectedOperator = this.options.find(o => o.operator === this.mutatedRule.operator)
      } else {
        this.selectedOperator = this.options[0]
      }
    }
  },

  computed: {
    options () {
      return this.selectedModel ? types[this.selectedModel.type] : []
    },

    availableInputs () {
      if (!this.selectedOperator) {
        return []
      }

      const inputs = []

      for (let i = 0, inputCount = this.selectedOperator.inputs || 1; i < inputCount; ++i) {
        inputs.push({
          id: `${this.mutatedRule.model.name}_${this.selectedOperator.operator}_${i}`,
          value: this.isOriginalOperatorSelected ? this.mutatedRule.value[i] : ''
        })
      }

      return inputs
    },

    isOriginalOperatorSelected () {
      return this.selectedModel === this.mutatedRule.model &&
        this.selectedOperator.operator === this.mutatedRule.operator
    }
  },

  created () {
    this.mutatedRule = Object.assign({}, this.rule)
    this.mutatedRule.model = this.selectedModel = this.models.find(m => m.name === this.mutatedRule.model)
    this.selectedOperator = this.options.find(o => o.operator === this.mutatedRule.operator)
  },

  methods: {
    onInput () {
      this.$emit('input', {
        id: this.mutatedRule.id,
        model: this.selectedModel.name,
        operator: this.selectedOperator.operator,
        value: this.availableInputs.map(input => input.value)
      })
    },

    removeRule () {
      this.$emit('remove')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.row {
  display: block;
  padding-bottom: 8px;
}

select {
  width: auto !important;
}
</style>
