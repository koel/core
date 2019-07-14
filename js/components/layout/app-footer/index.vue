<template>
  <footer id="mainFooter">
    <div class="side player-controls" id="playerControls">
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

    <div class="media-info-wrap">
      <middle-pane :song="song"/>

      <div class="other-controls" :class="{ 'with-gradient': prefs.showExtraPanel }">
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
    </div>
  </footer>
</template>

<script>
import { playback, socket } from '@/services'
import { isAudioContextSupported, event } from '@/utils'
import { songStore, favoriteStore, preferenceStore } from '@/stores'
import { views } from '@/config'


export default {
  data: () => ({
    song: songStore.stub,
    viewingQueue: false,

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

  components: {
    SoundBar: () => import('@/components/ui/sound-bar'),
    Equalizer: () => import('@/components/ui/equalizer'),
    Volume: () => import('@/components/ui/volume'),
    MiddlePane: () => import('@/components/layout/app-footer/middle-pane')
  },

  methods: {
    playPrev: () => playback.playPrev(),

    playNext: () => playback.playNext(),

    resume () {
      this.song.id ? playback.resume() : playback.playFirstInQueue()
    },

    pause: () => playback.pause(),

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
  },

  created () {
    event.on({
      /**
       * Listen to song:played event to set the current playing song.
       *
       * @param  {Object} song
       *
       * @return {Boolean}
       */
      [event.$names.SONG_PLAYED]: song => {
        this.song = song
      },

      /**
       * Listen to main-content-view:load event and highlight the Queue icon if
       * the Queue screen is being loaded.
       */
      [event.$names.LOAD_MAIN_CONTENT]: view => (this.viewingQueue = view === views.QUEUE)
    })
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#mainFooter {
  background: $color2ndBgr;
  height: $footerHeight;
  border-top: 1px solid $colorMainBgr;
  display: flex;
  position: relative;

  .media-info-wrap {
    flex: 1;
    display: flex;
  }

  .other-controls {
    @include vertical-center();
    @include hasSoftGradientOnTop($colorMainBgr);

    &.with-gradient {
      @include hasSoftGradientOnTop($colorExtraBgr);
    }

    text-transform: uppercase;
    flex: 0 0 $extraPanelWidth;
    color: $colorLink;

    .wrapper {
      display: inline-table;
    }

    .control {
      display: inline-block;
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

  @media only screen and (max-width: 768px) {
    height: $footerHeightMobile;
  }
}

#playerControls {
  @include vertical-center();
  flex: 0 0 256px;
  font-size: 1.8rem;
  background: $colorPlayerControlsBgr;

  @include hasSoftGradientOnTop($colorSidebarBgr);

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
