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

<script>
import { event } from '@/utils'
import { playback } from '@/services'
import YouTubePlayer from 'youtube-player'

let player

export default {
  data () {
    return {
      title: 'YouTube Video'
    }
  },

  methods: {
    /**
     * Initialize the YouTube player. This should only be called once.
     */
    initPlayer () {
      if (!player) {
        player = YouTubePlayer('player', {
          width: '100%',
          height: '100%'
        })

        // Pause song playback when video is played
        player.on('stateChange', event => event.data === 1 && playback.pause())
      }
    }
  },

  created () {
    event.on({
      [event.$names.PLAY_YOUTUBE_VIDEO]: ({ id, title }) => {
        this.title = title
        this.initPlayer()
        player.loadVideoById(id)
        player.playVideo()
      },

      /**
       * Stop video playback when a song is played/resumed.
       */
      [event.$names.SONG_PLAYED]: () => player && player.pauseVideo()
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

.none {
  color: $color2ndText;
  padding: 16px 24px;
}
</style>
