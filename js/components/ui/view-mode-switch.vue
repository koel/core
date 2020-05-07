<template>
  <span class="view-modes">
    <a
      class="thumbnails"
      :class="{ active: mode === 'thumbnails' }"
      title="View as thumbnails"
      @click.prevent="setMode('thumbnails')"
      role="button"
      href="#"
    >
      <i class="fa fa-th-large"></i>
    </a>
    <a
      class="list"
      :class="{ active: mode === 'list' }"
      title="View as list"
      @click.prevent="setMode('list')"
      role="button"
      href="#"
    >
      <i class="fa fa-list"></i>
    </a>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import isMobile from 'ismobilejs'

import { preferenceStore as preferences } from '@/stores'

export default Vue.extend({
  props: {
    for: {
      type: String,
      required: true,
      validator: value => ['albums', 'artists'].includes(value)
    }
  },

  computed: {
    /**
     * The preference key for local storage for persistent mode.
     */
    preferenceKey (): string {
      return `${this.for}ViewMode`
    },

    mode (): string {
      if (preferences[this.preferenceKey]) {
        return preferences[this.preferenceKey]
      }

      return isMobile.any ? 'list' : 'thumbnails'
    }
  },

  created (): void {
    this.$emit('viewModeChanged', this.mode)
  },

  methods: {
    setMode (mode: string): void {
      preferences[this.preferenceKey] = mode
      this.$emit('viewModeChanged', mode)
    }
  }
})
</script>

<style lang="scss" scoped>
.view-modes {
  display: flex;
  flex: 0 0 64px;
  border: 1px solid rgba(255, 255, 255, .2);
  border-radius: 5px;
  overflow: hidden;

  a {
    width: 50%;
    text-align: center;
    line-height: 2rem;
    font-size: 1rem;

    &.active {
      background: #fff;
      color: #111;
    }
  }

  @media only screen and(max-width: 768px) {
    flex: auto;
    width: 64px;
    margin-top: 8px;
  }
}
</style>
