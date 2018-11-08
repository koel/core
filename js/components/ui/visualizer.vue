<template>
  <div
    id="vizContainer"
    :class="{ 'fullscreen': isFullscreen }"
    ref="visualizerContainer"
    @dblclick="toggleFullscreen"
  >
    <global-events @keyup.esc="exitFullscreen"/>
    <a @click="hide" class="close"><i class="fa fa-times"></i></a>
  </div>
</template>

<script>
import initVisualizer from '@/utils/visualizer'
import { event } from '@/utils'

export default {
  data: () => ({
    isFullscreen: false
  }),

  methods: {
    toggleFullscreen () {
      if (this.isFullscreen) {
        const func =
          document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.mozExitFullScreen || // notice the uppercase S
          document.mozExitFullscreen ||
          document.msExitFullscreen
        func && func.apply(document)
      } else {
        const func =
          this.$refs.visualizerContainer.requestFullscreen ||
          this.$refs.visualizerContainer.webkitRequestFullscreen ||
          this.$refs.visualizerContainer.mozRequestFullScreen ||
          this.$refs.visualizerContainer.mozRequestFullscreen ||
          this.$refs.visualizerContainer.msRequestFullscreen
        func && func.apply(this.$refs.visualizerContainer)
      }
      this.isFullscreen = !this.isFullscreen
    },

    exitFullScreen () {
      this.isFullscreen && this.toggleFullscreen()
    },

    hide: () => event.emit(event.$names.TOGGLE_VISUALIZER)
  },

  mounted () {
    initVisualizer(this.$refs.visualizerContainer)
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#vizContainer {
  position: relative;

  &.fullscreen {
    // :fullscreen pseudo support is kind of buggy, so we use a class instead.
    background: $colorMainBgr;
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
