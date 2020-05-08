<template>
  <span class="song-list-controls-toggler" v-if="isPhone" @click="toggleControls">
    <i class="fa fa-angle-up toggler" v-if="showingControls"/>
    <i class="fa fa-angle-down toggler" v-else/>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import isMobile from 'ismobilejs'

export default Vue.extend({
  props: {
    showingControls: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    isPhone: isMobile.phone
  }),

  methods: {
    toggleControls (): void {
      this.$emit('toggleControls')
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

.toggler {
  font-size: 1rem;
  margin-left: 4px;
  color: $colorHighlight;
}
</style>
