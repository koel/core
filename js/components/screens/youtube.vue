<template>
  <section id="youtubeWrapper">
    <h1 class="heading"><span>{{ title }}</span></h1>
    <div id="player">
      <p class="none">Your YouTube video will be played here.<br/>
      You can start a video playback from the right sidebar. When a song is playing, that is.<br>
      It might also be worth noting that video’s volume, progress and such are controlled from within
      the video itself, and not via Koel’s controls.</p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { YouTubePlayer } from 'youtube-player/dist/types'
import { eventBus } from '@/utils'
import { events } from '@/config'
import { playback } from '@/services'
import createYouTubePlayer from 'youtube-player'

let player: YouTubePlayer

export default Vue.extend({
  data: () => ({
    title: 'YouTube Video'
  }),

  methods: {
    /**
     * Initialize the YouTube player. This should only be called once.
     */
    initPlayer (): void {
      if (!player) {
        player = createYouTubePlayer('player', {
          width: '100%',
          height: '100%'
        })

        // Pause song playback when video is played
        player.on('stateChange', (event: any): void => {
          if (event.data === 1) {
            playback.pause()
          }
        })
      }
    }
  },

  created (): void {
    eventBus.on({
      [events.PLAY_YOUTUBE_VIDEO]: ({ id, title }: { id: string, title: string }): void => {
        this.title = title
        this.initPlayer()
        player.loadVideoById(id)
        player.playVideo()
      },

      /**
       * Stop video playback when a song is played/resumed.
       */
      [events.SONG_STARTED]: (): void => {
        if (player) {
          player.pauseVideo()
        }
      }
    })
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

.none {
  color: $color2ndText;
  padding: 16px 24px;
}
</style>
