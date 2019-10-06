<template>
  <span class="volume control" id="volume">
    <i
      @click="unmute"
      class="fa fa-volume-off unmute"
      role="button"
      tabindex="0"
      title="Unmute"
      v-if="muted"
    ></i>
    <i
      @click="mute"
      class="fa fa-volume-up mute"
      role="button"
      tabindex="0"
      title="Mute"
      v-else
    ></i>
    <input
      @change="broadcastVolume"
      @input="setVolume"
      class="plyr__volume"
      id="volumeRange"
      max="10"
      step="0.1"
      title="Volume"
      type="range"
    >
  </span>
</template>

<script>
import { playback, socket } from '@/services'
import { event } from '@/utils'

export default {
  data: () => ({
    muted: false
  }),

  methods: {
    mute () {
      this.muted = true
      playback.mute()
    },

    unmute () {
      this.muted = false
      playback.unmute()
    },

    setVolume (e) {
      const volume = parseFloat(e.target.value)
      playback.setVolume(volume)
      this.muted = volume === 0
    },

    /**
     * Broadcast the volume changed event to remote controller.
     *
     * @param  {Event} e
     */
    broadcastVolume: e => socket.broadcast(event.$names.SOCKET_VOLUME_CHANGED, parseFloat(e.target.value))
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#volume {
  @include vertical-center();

  // More tweaks
  [type=range] {
    margin: -1px 0 0 5px;
  }

  i {
    width: 16px;
  }

  @media only screen and (max-width: 768px) {
    display: none !important;
  }
}
</style>
