<template>
  <footer id="mainFooter">
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
    viewingQueue: false,
  }),

  components: {
    MiddlePane: () => import('@/components/layout/app-footer/middle-pane'),
    PlayerControls: () => import('@/components/layout/app-footer/player-controls'),
    OtherControls: () => import('@/components/layout/app-footer/other-controls')
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

  @media only screen and (max-width: 768px) {
    height: $footerHeightMobile;
  }
}
</style>
