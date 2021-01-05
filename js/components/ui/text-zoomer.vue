<template>
  <div class="text-zoomer">
    <button @click.prevent="zoom(-1)" title="Zoom out"><i class="fa fa-search-minus"></i></button>
    <button @click.prevent="zoom(1)" title="Zoom in"><i class="fa fa-search-plus"></i></button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    target: {
      type: HTMLElement
    }
  },

  methods: {
    zoom (multiplier: number): void {
      if (!this.target) {
        return
      }

      const style = this.target.style

      if (style.fontSize === '') {
        style.fontSize = '1em'
        style.lineHeight = '1.6'
      }

      style.fontSize = parseFloat(style.fontSize) + multiplier * 0.2 + 'em'
      style.lineHeight = String(parseFloat(style.lineHeight) + multiplier * 0.15)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_mixins";

.text-zoomer {
  display: flex;
  transition: .2s;

  button {
    @include inset-when-pressed();

    background: var(--color-background-panes);
    border: 1px solid var(--color-grey);
    color: rgba(255, 255, 255, .5);
    transition: background .2s;
    padding: .5rem .75rem;

    &:hover {
      background: var(--color-grey);
      color: var(--color-white);
    }

    &:first-of-type {
      border-radius: 4px 0 0 4px;
      border-right: 0;
    }

    &:last-of-type {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
