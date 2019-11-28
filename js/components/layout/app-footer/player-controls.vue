<template>
  <div class="side player-controls">
    <i
      @click.prevent="playPrev"
      class="prev fa fa-step-backward control"
      role="button"
      tabindex="0"
      title="Play previous song"
    ></i>

    <span
      @click.prevent="resume"
      class="play control"
      role="button"
      v-if="song.playbackState !== 'playing'"
      tabindex="0"
      title="Play or resume"
    >
      <i class="fa fa-play"></i>
    </span>
    <span @click.prevent="pause" class="pause control" role="button" title="Pause" tabindex="0" v-else>
      <i class="fa fa-pause"></i>
    </span>

    <i
      @click.prevent="playNext"
      class="next fa fa-step-forward control"
      role="button"
      tabindex="0"
      title="Play next song"
    ></i>
  </div>
</template>

<script>
import { playback } from '@/services'

export default {
  props: {
    song: {
      required: true,
      type: Object
    }
  },

  methods: {
    playPrev: () => playback.playPrev(),

    playNext: () => playback.playNext(),

    resume () {
      this.song.id ? playback.resume() : playback.playFirstInQueue()
    },

    pause: () => playback.pause()
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.player-controls {
  @include vertical-center();
  flex: 0 0 256px;
  font-size: 1.8rem;
  background: $colorPlayerControlsBgr;

  .prev, .next {
    transition: .3s;
  }

  .play, .pause {
    font-size: 2rem;
    display: inline-block;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
    border: 1px solid #a0a0a0;
    margin: 0 16px;
    text-indent: 2px;
  }

  .pause {
    text-indent: 0;
    font-size: 18px;
  }

  .enabled {
    opacity: 1;
  }

  @media only screen and (max-width: 768px) {
    flex: 1;

    &::before {
      display: none;
    }
  }
}
</style>
