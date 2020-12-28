<template>
  <header class="screen-header">
    <div class="thumbnail-wrapper" :class="{ 'non-empty': hasThumbnail }" ref="thumbnailWrapper">
      <slot name="thumbnail"></slot>
    </div>

    <div class="heading-wrapper">
      <h1>
        <slot></slot>
      </h1>
      <span class="meta">
        <slot name="meta"></slot>
      </span>
    </div>

    <slot name="controls"></slot>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    hasThumbnail: false
  }),

  updated () {
    // until :empty is supported, we'll have to resort to this manual check
    this.hasThumbnail = Boolean((this.$refs.thumbnailWrapper as HTMLElement).children.length)
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

header {
  display: flex;
  gap: 1rem;
  font-weight: $fontWeight_UltraThin;
  font-size: 2.76rem;
  padding: 1rem 1.8rem;
  border-bottom: 1px solid $color2ndBgr;
  min-height: 96px;
  position: relative;
  align-items: center;
  align-content: stretch;
  line-height: normal;
  background: rgba(0, 0, 0, .1);

  .thumbnail-wrapper{
    width: 64px;
    display: none;

    &.non-empty {
      display: block;
    }
  }

  h1 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .heading-wrapper {
    overflow: hidden;
    flex: 1;
  }

  .meta {
    display: block;
    font-size: .9rem;
    line-height: 2;
    color: $color2ndText;
    font-weight: $fontWeight_Thin;

    a {
      color: #fff;

      &:hover {
        color: $colorHighlight;
      }
    }
  }

  @media (max-width: 768px) {
    min-height: 0;
    flex-direction: column;

    .thumbnail-wrapper {
      display: none;
    }

    h1 {
      font-size: 1.38rem;
    }

    .meta {
      display: none;
    }
  }
}
</style>
