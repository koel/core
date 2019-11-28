<template>
  <div class="other-controls">
    <div class="wrapper" v-koel-clickaway="closeEqualizer">
      <equalizer v-if="useEqualizer" v-show="showEqualizer"/>

      <a @click.prevent="toggleVisualizer" title="Click for a marvelous visualizer!" role="button" tabindex="0">
        <sound-bar v-if="song.playbackState === 'playing'"/>
      </a>

      <i
        :class="{ liked: song.liked }"
        @click.prevent="like"
        class="like control fa fa-heart"
        v-if="song.id"
        role="button"
        tabindex="0"
        :title="`${ song.liked ? 'Unlike' : 'Like' } current song`"
      ></i>

      <span
        :class="{ active: prefs.showExtraPanel }"
        @click.prevent="toggleExtraPanel"
        class="control info"
        role="button"
        tabindex="0"
        title="View song information"
      >
        Info
      </span>

      <i
        :class="{ active: showEqualizer }"
        @click="showEqualizer = !showEqualizer"
        class="fa fa-sliders control equalizer"
        v-if="useEqualizer"
        role="button"
        tabindex="0"
        :title="`${ showEqualizer ? 'Hide' : 'Show'} equalizer`"
      ></i>

      <a v-else class="queue control" :class="{ active: viewingQueue }" href="#!/queue">
        <i class="fa fa-list-ol"></i>
      </a>

      <span
        :class="prefs.repeatMode"
        @click.prevent="changeRepeatMode"
        class="repeat control"
        role="button"
        tabindex="0"
        :title="`Change repeat mode (current mode: ${prefs.repeatMode})`"
      >
        <i class="fa fa-repeat"></i>
      </span>

      <volume/>
    </div>
  </div>
</template>

<script>
import { playback, socket } from '@/services'
import { event, isAudioContextSupported } from '@/utils'
import { songStore, favoriteStore, preferenceStore } from '@/stores'

export default {
  props: {
    song: {
      required: true,
      type: Object
    }
  },

  components: {
    Equalizer: () => import('@/components/ui/equalizer'),
    SoundBar: () => import('@/components/ui/sound-bar'),
    Volume: () => import('@/components/ui/volume')
  },

  data: () => ({
    prefs: preferenceStore.state,
    showEqualizer: false,

    /**
     * Indicate if we should build and use an equalizer.
     *
     * @type {Boolean}
     */
    useEqualizer: isAudioContextSupported,
    visualizerActivated: false
  }),

  methods: {
    changeRepeatMode: () => playback.changeRepeatMode(),

    like () {
      if (this.song.id) {
        favoriteStore.toggleOne(this.song)
        socket.broadcast(event.$names.SOCKET_SONG, songStore.generateDataToBroadcast(this.song))
      }
    },

    toggleExtraPanel () {
      preferenceStore.set('showExtraPanel', !this.prefs.showExtraPanel)
    },

    closeEqualizer () {
      this.showEqualizer = false
    },

    toggleVisualizer: () => event.emit(event.$names.TOGGLE_VISUALIZER)
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.other-controls {
  @include vertical-center();

  position: relative;
  text-transform: uppercase;
  flex: 0 0 $extraPanelWidth;
  color: $colorLink;

  .wrapper {
    @include vertical-center();
  }

  .control {
    padding: 0 8px;

    &.active {
      color: $colorHighlight;
    }

    &:last-child {
      padding-right: 0;
    }
  }

  .repeat {
    position: relative;

    &.REPEAT_ALL, &.REPEAT_ONE {
      color: $colorHighlight;
    }

    &.REPEAT_ONE::after {
      content: "1";
      position: absolute;
      top: 0;
      left: 0;
      font-weight: 700;
      font-size: .5rem;
      text-align: center;
      width: 100%;
    }
  }

  .like {
    &.liked {
      color: $colorHeart;
    }
  }

  @media only screen and (max-width: 768px) {
    position: absolute !important;
    right: 0;
    top: 0;
    height: 100%;
    width: 188px;

    &::before {
      display: none;
    }

    .queue {
      display: none;
    }

    .control {
      padding: 0 8px;
    }
  }
}
</style>
