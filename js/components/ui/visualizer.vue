<template>
  <div
    :class="{ fullscreen: isFullscreen }"
    @dblclick="toggleFullscreen"
    id="vizContainer"
    ref="visualizerContainer"
  >
    <a @click="hide" class="close"><i class="fa fa-times"></i></a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import initVisualizer from '@/utils/visualizer'
import { eventBus } from '@/utils'
import { events } from '@/config'

export default Vue.extend({
  data: () => ({
    isFullscreen: false
  }),

  methods: {
    toggleFullscreen (): void {
      if (this.isFullscreen) {
        document.exitFullscreen()
      } else {
        (this.$refs.visualizerContainer as HTMLElement).requestFullscreen()
      }

      this.isFullscreen = !this.isFullscreen
    },

    hide: (): void => {
      eventBus.emit(events.TOGGLE_VISUALIZER)
    }
  },

  mounted (): void {
    initVisualizer(this.$refs.visualizerContainer as HTMLElement)
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#vizContainer {
  position: relative;

  &.fullscreen {
    // :fullscreen pseudo support is kind of buggy, so we use a class instead.
    background: $colorMainBgr;

    .close {
      opacity: 0 !important;
    }
  }

  .close {
    @include close-modal-button();
    opacity: 0;
  }

  &:hover {
    .close {
      opacity: 1;
    }
  }
}
</style>
