<template>
  <div class="other-controls">
    <div class="wrapper" v-koel-clickaway="closeEqualizer">
      <equalizer v-show="showEqualizer" v-if="useEqualizer"/>

      <a @click.prevent="toggleVisualizer" title="Click for a marvelous visualizer!" role="button" tabindex="0">
        <sound-bar v-if="song && song.playbackState === 'Playing'"/>
      </a>

      <i
        :class="{ liked: song.liked }"
        @click.prevent="like"
        class="like control fa fa-heart"
        v-if="song"
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
        @click="toggleEqualizer"
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

      <span
        @click.prevent="downloadCurrentSong"
        class="download control"
        role="button"
        tabindex="0"
        title="Download the current song"
        v-if="downloadable"
      >
        <i class="fa fa-download"></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { download, playback, socket } from '@/services'
import { eventBus, isAudioContextSupported } from '@/utils'
import { events } from '@/config'
import { favoriteStore, preferenceStore, sharedStore, songStore } from '@/stores'

export default Vue.extend({
  props: {
    song: {
      type: Object
    } as PropOptions<Song>
  },

  components: {
    Equalizer: () => import('@/components/ui/equalizer.vue'),
    SoundBar: () => import('@/components/ui/sound-bar.vue'),
    Volume: () => import('@/components/ui/volume.vue')
  },

  data: () => ({
    prefs: preferenceStore.state,
    showEqualizer: false,
    sharedState: sharedStore.state,
    useEqualizer: isAudioContextSupported,
    viewingQueue: false
  }),

  computed: {
    downloadable (): boolean {
      return Boolean(this.sharedState.allowDownload && this.song && this.song.id)
    }
  },

  methods: {
    changeRepeatMode: (): void => playback.changeRepeatMode(),

    like (): void {
      if (this.song.id) {
        favoriteStore.toggleOne(this.song)
        socket.broadcast(events.SOCKET_SONG, songStore.generateDataToBroadcast(this.song))
      }
    },

    toggleExtraPanel (): void {
      preferenceStore.set('showExtraPanel', !this.prefs.showExtraPanel)
    },

    toggleEqualizer (): void {
      this.showEqualizer = !this.showEqualizer
    },

    closeEqualizer (): void {
      this.showEqualizer = false
    },

    toggleVisualizer: (): void => {
      eventBus.emit(events.TOGGLE_VISUALIZER)
    },

    downloadCurrentSong (): void {
      download.fromSongs(this.song)
    }
  },

  created (): void {
    eventBus.on(events.LOAD_MAIN_CONTENT, (view: MainViewName): void => {
      this.viewingQueue = view === 'Queue'
    })
  }
})
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
