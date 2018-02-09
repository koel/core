<template>
  <div
    id="vizContainer"
    :class="{ 'app-full-screen': isAppFullScreen }"
    ref="visualizerContainer"
    @dblclick="toggleFullScreen"
  >
    <global-events @keyup.esc="exitFullScreen"/>
  </div>
</template>

<script>
import initVisualizer from '@/utils/visualizer'
import { event } from '@/utils'

export default {
  data () {
    return {
      isFullScreen: false,
      isAppFullScreen: false
    }
  },

  methods: {
    toggleFullScreen () {
      if (KOEL_ENV === 'app') {
        // since Electron doesn't support HTML5 fullscreen API, we do a faux version
        this.isAppFullScreen = !this.isAppFullScreen
        this.isFullScreen = !this.isFullScreen
        return
      }

      let func
      if (this.isFullScreen) {
        func =
          this.$refs.visualizerContainer.exitFullScreen ||
          this.$refs.visualizerContainer.webkitExitFullScreen ||
          this.$refs.visualizerContainer.mozExitFullScreen ||
          this.$refs.visualizerContainer.msExitFullscreen
      } else {
        func =
          this.$refs.visualizerContainer.requestFullScreen ||
          this.$refs.visualizerContainer.webkitRequestFullScreen ||
          this.$refs.visualizerContainer.mozRequestFullScreen ||
          this.$refs.visualizerContainer.msRequestFullscreen
      }
      func && func()
      this.isFullScreen = !this.isFullScreen
    },

    exitFullScreen () {
      this.isFullScreen && this.toggleFullScreen()
    }
  },

  created () {
    event.on('visualizer:init', () => {
      initVisualizer(this.$refs.visualizerContainer)
    })
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

.app-full-screen {
  background: $colorMainBgr;
  height: 100%;
  width: 100%;
  z-index: 9998;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
