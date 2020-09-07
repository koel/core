<template>
  <div id="app" :class="{ 'standalone' : inStandaloneMode }">
    <template v-if="authenticated">
      <album-art-overlay :album="album" v-if="preferences.showAlbumArtOverlay"/>

      <div id="main" data-cy="main">
        <template v-if="connected">
          <div class="details" v-if="song">
            <div class="cover" :style="{ backgroundImage: 'url('+song.album.cover+')' }"></div>
            <div class="info">
              <div class="wrap">
                <p class="title text">{{ song.title }}</p>
                <p class="artist text">{{ song.artist.name }}</p>
                <p class="album text">{{ song.album.name }}</p>
              </div>
            </div>
          </div>
          <div class="none" v-else>
            <p>No song is playing.</p>
          </div>
          <footer>
            <a class="favorite" @click.prevent="toggleFavorite">
              <i class="fa fa-heart yep" v-if="song && song.liked"></i>
              <i class="fa fa-heart-o" v-else></i>
            </a>
            <a class="prev" @click="playPrev">
              <i class="fa fa-step-backward"></i>
            </a>
            <a class="play-pause" @click.prevent="togglePlayback">
              <i class="fa fa-pause" v-if="playing"></i>
              <i class="fa fa-play" v-else></i>
            </a>
            <a class="next" @click.prevent="playNext">
              <i class="fa fa-step-forward"></i>
            </a>
            <span class="volume">
              <span id="volumeSlider" v-show="showingVolumeSlider"></span>
              <span class="icon" @click.prevent="toggleVolumeSlider">
                <i class="fa fa-volume-off" v-if="muted"></i>
                <i class="fa fa-volume-up" v-else></i>
              </span>
            </span>
          </footer>
        </template>
        <div v-else class="loader">
          <div v-if="!maxRetriesReached">
            <p><span>Searching for Koel…</span></p>
            <div class="signal"></div>
          </div>
          <div v-else>
            <p>No active Koel instance found.
              <a @click.prevent="rescan" class="rescan">Rescan</a>
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="login-wrapper" data-cy="loginForm" v-else>
      <login-form @loggedin="onUserLoggedIn"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import nouislider from 'nouislider'
import { socket, auth } from '@/services'
import { userStore, preferenceStore } from '@/stores'
import { events } from '@/config'
import LoginForm from '@/components/auth/login-form.vue'
import { SliderElement } from 'koel/types/ui'

let volumeSlider: SliderElement
const MAX_RETRIES = 10

export default Vue.extend({
  components: {
    LoginForm,
    AlbumArtOverlay: () => import('@/components/ui/album-art-overlay.vue')
  },

  data: () => ({
    authenticated: false,
    song: null as unknown as Song,
    lastActiveTime: new Date().getTime(),
    inStandaloneMode: false,
    connected: false,
    muted: false,
    showingVolumeSlider: false,
    retries: 0,
    preferences: preferenceStore.state,
    volume: 7
  }),

  watch: {
    connected (): void {
      this.$nextTick((): void => {
        volumeSlider = document.getElementById('volumeSlider') as SliderElement

        nouislider.create(volumeSlider, {
          orientation: 'vertical',
          connect: [true, false],
          start: this.volume,
          range: { min: 0, max: 10 },
          direction: 'rtl'
        })

        if (!volumeSlider.noUiSlider) {
          throw new Error('Failed to initialize noUISlider on element #volumeSlider')
        }

        volumeSlider.noUiSlider.on('change', (values: number[], handle: number): void => {
          const volume = values[handle]
          this.muted = !volume
          socket.broadcast(events.SOCKET_SET_VOLUME, { volume })
        })
      })
    },

    volume: (value: number): void => volumeSlider.noUiSlider!.set(value)
  },

  methods: {
    onUserLoggedIn (): void {
      this.authenticated = true
      this.init()
    },

    async init (): Promise<void> {
      try {
        const user = await userStore.getProfile()
        userStore.init([], user)

        await socket.init()

        socket
          .listen(events.SOCKET_SONG, ({ song }: { song: Song }): void => {
            this.song = song
          })
          .listen(events.SOCKET_PLAYBACK_STOPPED, (): void => {
            this.song && (this.song.playbackState = 'Stopped')
          })
          .listen(events.SOCKET_VOLUME_CHANGED, (volume: number): void => volumeSlider.noUiSlider!.set(volume))
          .listen(events.SOCKET_STATUS, ({ song, volume }: { song: Song, volume: number }): void => {
            this.song = song
            this.volume = volume
            this.connected = true
          })

        this.scan()
      } catch (e) {
        console.error(e)
        this.authenticated = false
      }
    },

    toggleVolumeSlider (): void {
      this.showingVolumeSlider = !this.showingVolumeSlider
    },

    toggleFavorite (): void {
      if (!this.song) {
        return
      }

      this.song.liked = !this.song.liked
      socket.broadcast(events.SOCKET_TOGGLE_FAVORITE)
    },

    togglePlayback (): void {
      if (this.song) {
        this.song.playbackState = this.song.playbackState === 'Playing' ? 'Paused' : 'Playing'
      }

      socket.broadcast(events.SOCKET_TOGGLE_PLAYBACK)
    },

    playNext: (): void => {
      socket.broadcast(events.SOCKET_PLAY_NEXT)
    },

    playPrev: (): void => {
      socket.broadcast(events.SOCKET_PLAY_PREV)
    },

    getStatus: (): void => {
      socket.broadcast(events.SOCKET_GET_STATUS)
    },

    scan (): void {
      if (!this.connected) {
        if (!this.maxRetriesReached) {
          this.getStatus()
          this.retries++
          window.setTimeout(this.scan, 1000)
        }
      } else {
        this.retries = 0
      }
    },

    rescan (): void {
      this.retries = 0
      this.scan()
    }
  },

  computed: {
    playing (): boolean {
      return Boolean(this.song && this.song.playbackState === 'Playing')
    },

    maxRetriesReached (): boolean {
      return this.retries >= MAX_RETRIES
    },

    album (): Album | null {
      return this.song ? this.song.album : null
    }
  },

  created (): void {
    // @ts-ignore
    this.inStandaloneMode = window.navigator.standalone
  },

  mounted (): void {
    // The app has just been initialized, check if we can get the user data with an already existing token
    if (auth.hasToken()) {
      this.authenticated = true
      this.init()
    }
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";
@import "~#/partials/_shared.scss";

body, html {
  height: 100vh;
}

#app {
  height: 100vh;
  background: $colorMainBgr;

  .login-wrapper {
    display: flex;
    min-height: 100vh;
    flex-direction: column;

    @include vertical-center();
  }

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    position: relative;

    p {
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      padding-bottom: 40px;
    }

    .signal {
      border: 1px solid $colorOrange;
      border-radius: 50%;
      height: 0;
      opacity: 0;
      width: 50vw;
      animation: pulsate 1.5s ease-out;
      animation-iteration-count: infinite;
      transform: translate(-50%, -50%);
    }

    .rescan {
      margin-left: 5px;
      color: $colorOrange;
    }

    @keyframes pulsate {
      0% {
        transform:scale(.1);
        opacity: 0.0;
      }
      50% {
        opacity:1;
      }
      100% {
        transform:scale(1.2);
        opacity:0;
      }
    }
  }
}

#main {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  z-index: 1;
  position: relative;

  .none, .details {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .details {
    .info {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .cover {
      margin: 0 auto;
      width: calc(70vw + 4px);
      height: calc(70vw + 4px);
      border-radius: 50%;
      border: 2px solid #fff;
      background-position: center center;
      background-size: cover;
      background-color: #2d2f2f;
    }

    .text {
      max-width: 90%;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.3;
    }

    .title {
      font-size: 6vmin;
      font-weight: bold;
      margin: 0 auto 10px;
    }

    .artist {
      font-size: 5vmin;
      margin: 0 auto 6px;
      font-weight: 100;
      opacity: .5;
    }

    .album {
      font-size: 4vmin;
      font-weight: 100;
      opacity: .5;
    }
  }

  footer {
    height: 18vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, .1);
    font-size: 5vmin;

    a {
      color: #fff;

      &:active {
        opacity: .8;
      }
    }

    .favorite {
      .yep {
        color: #bf2043;
      }
    }

    .prev, .next {
      font-size: 6vmin;
    }

    .play-pause {
      display: inline-block;
      width: 16vmin;
      height: 16vmin;
      border: 1px solid #fff;
      border-radius: 50%;
      line-height: 16vmin;
      font-size: 7vmin;

      &.fa-play {
        margin-left: 4px;
      }
    }
  }
}

#app.standalone {
  padding-top: 20px;

  #main {
    .details {
      .cover {
        width: calc(80vw - 4px);
        height: calc(80vw - 4px);
      }
    }

    .footer {
      height: 20vh;
    }
  }
}

.volume {
  position: relative;

  .icon {
    width: 20px;
    display: inline-block;
    text-align: center;
  }
}

#volumeSlider {
  height: 80px;
  position: absolute;
  bottom: calc(50% + 26px);
}

.noUi-target {
  background: #fff;
  border-radius: 4px;
  border: 0;
  box-shadow: none;
  left: 7px;
}

.noUi-base {
  height: calc(100% - 16px);
  border-radius: 4px;
}

.noUi-vertical {
  width: 8px;
}

.noUi-vertical .noUi-handle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 0;
  left: -4px;
  top: 0;

  &::after, &::before {
    display: none;
  }
}

.noUi-connect {
  background: transparent;
  box-shadow: none;
}
</style>
