<template>
  <footer id="mainFooter" @contextmenu.prevent="requestContextMenu">
    <player-controls :song="song"/>

    <div class="media-info-wrap">
      <middle-pane :song="song"/>
      <other-controls :song="song"/>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
import { eventBus } from '@/utils'
import { events } from '@/config'
import OtherControls from '@/components/layout/app-footer/other-controls.vue'
import MiddlePane from '@/components/layout/app-footer/middle-pane.vue'
import PlayerControls from '@/components/layout/app-footer/player-controls.vue'

export default Vue.extend({
  data: () => ({
    song: null as unknown as Song,
    viewingQueue: false
  }),

  components: {
    MiddlePane,
    PlayerControls,
    OtherControls
  },

  methods: {
    requestContextMenu (e: MouseEvent): void {
      if (this.song.id) {
        eventBus.emit(events.CONTEXT_MENU_REQUESTED, e, this.song)
      }
    }
  },

  created (): void {
    eventBus.on({
      /**
       * Listen to song:played event to set the current playing song.
       */
      [events.SONG_STARTED]: (song: Song): void => {
        this.song = song
      },

      /**
       * Listen to main-content-view:load event and highlight the Queue icon if
       * the Queue screen is being loaded.
       */
      [events.LOAD_MAIN_CONTENT]: (view: MainViewName): void => {
        this.viewingQueue = view === 'Queue'
      }
    })
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

footer {
  background: $color2ndBgr;
  height: $footerHeight;
  display: flex;
  position: relative;
  z-index: 9;

  .media-info-wrap {
    flex: 1;
    display: flex;
  }

  position: relative;

  // Add a reverse gradient here to elimate the "hard cut" feel.
  &::before {
    $gradientHeight: 2 * $footerHeight / 3;
    content: " ";
    position: absolute;
    width: 100%;
    height: $gradientHeight;
    top: -$gradientHeight;
    left: 0;

    // Safari 8 won't recognize rgba(255, 255, 255, 0) and treat it as black.
    // rgba($colorMainBgr, 0) is a workaround.
    background-image: linear-gradient(to bottom, rgba(#000, 0) 0%, rgba(#000, .2) 100%);
    pointer-events: none; // click-through
  }

  @media only screen and (max-width: 768px) {
    height: $footerHeightMobile;
  }
}
</style>
