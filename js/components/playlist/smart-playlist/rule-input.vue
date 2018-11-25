<template>
  <input :type="type" v-model="mutableValue" required>
</template>

<script>
import types from '@/config/smart-playlist/types'

export default {
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

  data () {
    return {
      mutableValue: this.value
    }
  },

  watch: {
    mutableValue () {
      this.$emit('input', this.mutableValue)
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  display: inline-block;
  width: 140px !important;
}
</style>

