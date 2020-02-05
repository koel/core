<template>
  <footer id="mainFooter" @contextmenu.prevent="requestContextMenu">
    <player-controls :song="song"/>

    <div class="media-info-wrap">
      <middle-pane :song="song"/>
      <other-controls :song="song"/>
    </div>
  </footer>
</template>

<script>
import { event } from '@/utils'
import { songStore } from '@/stores'
import { views } from '@/config'

export default {
  data: () => ({
    song: songStore.stub,
    viewingQueue: false
  }),

  components: {
    MiddlePane: () => import('@/components/layout/app-footer/middle-pane'),
    PlayerControls: () => import('@/components/layout/app-footer/player-controls'),
    OtherControls: () => import('@/components/layout/app-footer/other-controls')
  },

  methods: {
    requestContextMenu (e) {
      if (this.song.id) {
        event.emit(event.$names.CONTEXT_MENU_REQUESTED, e, this.song)
      }
    }
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
