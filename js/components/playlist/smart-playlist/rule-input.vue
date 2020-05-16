<template>
  <input :type="type" v-model="mutableValue" required>
</template>

<script lang="ts">
import Vue from 'vue'
import types from '@/config/smart-playlist/types'

export default Vue.extend({
  props: {
    type: {
      type: String,
      validator: value => Object.keys(types).includes(value)
    },

    value: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    mutableValue: this.value
  }),

  watch: {
    mutableValue (): void {
      this.$emit('input', this.mutableValue)
    }
  }
})
</script>

<style lang="scss" scoped>
input {
  display: inline-block;
  width: 140px !important;
}
</style>
