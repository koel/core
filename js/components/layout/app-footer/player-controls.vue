<template>
  <div class="side player-controls">
    <i
      @click.prevent="playPrev"
      class="prev fa fa-step-backward control"
      role="button"
      tabindex="0"
      title="Play previous song"
    ></i>

    <span class="album-thumb-wrapper">
      <span :style="{ backgroundImage: `url('${cover}')` }" class="album-thumb"></span>
      <span
        @click.prevent="toggle"
        class="play control"
        role="button"
        v-if="song.playbackState !== 'playing'"
        tabindex="0"
        title="Play or resume"
      >
        <i class="fa fa-play"></i>
      </span>
      <span @click.prevent="toggle" class="pause control" role="button" title="Pause" tabindex="0" v-else>
        <i class="fa fa-pause"></i>
      </span>
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
import { getDefaultCover } from '@/utils'

export default {
  props: {
    song: {
      required: true,
      type: Object
    }
  },

  computed: {
    cover () {
      return this.song.album.cover ? this.song.album.cover : getDefaultCover()
    }
  },

  methods: {
    playPrev: () => playback.playPrev(),

    playNext: () => playback.playNext(),

    toggle: () => playback.toggle()
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

  &:hover {
    .album-thumb-wrapper {
      margin-left: 12px;
      margin-right: 12px;
    }

    .prev, .next {
      opacity: 1;
    }

    .play, .pause {
      opacity: .7;
    }
  }

  .album-thumb-wrapper {
    flex: 0 0 $footerHeight + 30px;
    height: $footerHeight + 30px;
    transition: .4s ease-out;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid rgb(33, 33, 33);
    margin-left: -40px;
    margin-right: -40px;

    @include vertical-center();

    &:hover {
      .album-thumb {
        transform: scale(1.1);
      }

      .play, .pause {
        opacity: 1;
      }
    }
  }

  .album-thumb {
    position: relative;
    background-color: $colorPlayerControlsBgr;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 0;
    border-radius: 50%;
    background-size: cover;
    transition: .2s ease-out;
  }

  .prev, .next {
    transition: .4s ease-out;
    opacity: 0;
  }

  .play, .pause {
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    transition: .4s ease-out;
    font-size: 3rem;
    display: inline-block;
    width: 100%;
    height: 100%;
    line-height: $footerHeight + 30px;
    text-align: center;
    text-indent: 2px;
    color: #fff;
    opacity: 0;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  }

  .pause {
    text-indent: 0;
    font-size: 2rem;
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
