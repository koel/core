<template>
  <li :class="{ available: song }" :title="tooltip" @click="play" role="button" tabindex="0">
    <span class="no">{{ index + 1 }}</span>
    <span class="title">{{ track.title }}</span>
    <a
      :href="iTunesUrl"
      v-if="useiTunes && !song"
      target="_blank"
      class="view-on-itunes"
      title="View on iTunes"
      >
      iTunes
    </a>
    <span class="length">{{ track.fmtLength }}</span>
  </li>
</template>

<script>
import { songStore, queueStore, sharedStore } from '@/stores'
import { ls, playback } from '@/services'

export default {
  props: {
    album: {
      type: Object,
      required: true
    },
    track: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    useiTunes: sharedStore.state.useiTunes
  }),

  computed: {
    song () {
      return songStore.guess(this.track.title, this.album)
    },

    tooltip () {
      return this.song ? 'Click to play' : ''
    },

    iTunesUrl () {
      return `${window.BASE_URL}api/itunes/song/${this.album.id}?q=${encodeURIComponent(this.track.title)}&jwt-token=${ls.get('jwt-token')}`
    }
  },

  methods: {
    play () {
      if (this.song) {
        queueStore.contains(this.song) || queueStore.queueAfterCurrent(this.song)
        playback.play(this.song)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

[role=button] {
  &:focus {
    span.title {
      color: $colorHighlight;
    }
  }

  a.view-on-itunes {
    display: inline-block;
    border-radius: 3px;
    font-size: .8rem;
    padding: 0 5px;
    color: #fff;
    background: rgba(255, 255, 255, .1);
    height: 20px;
    line-height: 20px;
    margin-left: 4px;

    &:hover, &:focus {
      background: linear-gradient(27deg, #fe5c52 0%,#c74bd5 50%,#2daaff 100%);
      color: #fff;
    }

    &:active {
      box-shadow: inset 0px 5px 5px -5px #000;
    }
  }
}
</style>