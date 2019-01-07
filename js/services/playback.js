import { shuffle, orderBy } from 'lodash'
import plyr from 'plyr'
import Vue from 'vue'
import isMobile from 'ismobilejs'

import { event, isMediaSessionSupported } from '@/utils'
import {
  queueStore,
  sharedStore,
  userStore,
  songStore,
  recentlyPlayedStore,
  preferenceStore as preferences
} from '@/stores'
import { socket, audio as audioService } from '.'
import { app } from '@/config'
import router from '@/router'

/**
 * The number of seconds before the current song ends to start preload the next one.
 */
const PRELOAD_BUFFER = 30

let mainWin
if (KOEL_ENV === 'app') {
  mainWin = require('electron').remote.getCurrentWindow()
}

export const playback = {
  player: null,
  volumeInput: null,
  repeatModes: ['NO_REPEAT', 'REPEAT_ALL', 'REPEAT_ONE'],
  initialized: false,

  init () {
    // We don't need to init this service twice, or the media events will be duplicated.
    if (this.initialized) {
      return
    }

    this.player = plyr.setup({
      controls: []
    })[0]

    this.audio = document.querySelector('audio')
    this.volumeInput = document.getElementById('volumeRange')

    const player = document.querySelector('.plyr')

    player.addEventListener('error', () => this.playNext(), true)

    player.addEventListener('ended', e => {
      if (sharedStore.state.useLastfm && userStore.current.preferences.lastfm_session_key) {
        songStore.scrobble(queueStore.current)
      }

      preferences.repeatMode === 'REPEAT_ONE' ? this.restart() : this.playNext()
    })

    player.addEventListener('canplay', () => {
      const song = queueStore.current
      recentlyPlayedStore.add(song)
      songStore.registerPlay(song)
      recentlyPlayedStore.fetchAll()
    })

    player.addEventListener('timeupdate', e => {
      if (
        this.player.media.duration &&
        this.player.media.currentTime + PRELOAD_BUFFER > this.player.media.duration
      ) {
        // Try preloading the next song
        const nextSong = queueStore.next

        if (!nextSong || nextSong.preloaded || (isMobile.any && preferences.transcodeOnMobile)) {
          return
        }

        const audio = document.createElement('audio')
        audio.setAttribute('src', songStore.getSourceUrl(nextSong))
        audio.setAttribute('preload', 'auto')
        audio.load()
        nextSong.preloaded = true
      }
    })

    // On init, set the volume to the value found in the local storage.
    this.setVolume(preferences.volume)

    audioService.init(this.player.media)
    event.emit(event.$names.INIT_EQUALIZER)

    if (isMediaSessionSupported) {
      navigator.mediaSession.setActionHandler('play', () => this.resume())
      navigator.mediaSession.setActionHandler('pause', () => this.pause())
      navigator.mediaSession.setActionHandler('previoustrack', () => this.playPrev())
      navigator.mediaSession.setActionHandler('nexttrack', () => this.playNext())
    }

    socket.listen(event.$names.SOCKET_TOGGLE_PLAYBACK, () => this.toggle())
      .listen(event.$names.SOCKET_PLAY_NEXT, () => this.playNext())
      .listen(event.$names.SOCKET_PLAY_PREV, () => this.playPrev())
      .listen(event.$names.SOCKET_GET_STATUS, () => {
        const data = queueStore.current ? songStore.generateDataToBroadcast(queueStore.current) : {}
        data.volume = this.volumeInput.value
        socket.broadcast(event.$names.SOCKET_STATUS, data)
      })
      .listen(event.$names.SOCKET_GET_CURRENT_SONG, () => {
        socket.broadcast(
          event.$names.SOCKET_SONG,
          queueStore.current
            ? songStore.generateDataToBroadcast(queueStore.current)
            : { song: null }
        )
      })
      .listen(event.$names.SOCKET_SET_VOLUME, ({ volume }) => this.setVolume(volume))

    this.initialized = true
  },

  /**
   * Play a song. Because
   *
   * So many adventures couldn't happen today,
   * So many songs we forgot to play
   * So many dreams swinging out of the blue
   * We'll let them come true
   *
   * @param  {Object} song The song to play
   */
  play (song) {
    if (!song) {
      return
    }

    if (queueStore.current) {
      queueStore.current.playbackState = 'stopped'
    }

    song.playbackState = 'playing'
    queueStore.current = song

    // Manually set the `src` attribute of the audio to prevent plyr from resetting
    // the audio media object and cause our equalizer to malfunction.
    this.player.media.src = songStore.getSourceUrl(song)

    document.title = `${song.title} ♫ ${app.name}`
    document.querySelector('.plyr audio').setAttribute('title', `${song.artist.name} - ${song.title}`)

    // We'll just "restart" playing the song, which will handle notification, scrobbling etc.
    this.restart()
  },

  showNotification (song) {
    if (!window.Notification || !preferences.notify) {
      return
    }

    try {
      const notif = new window.Notification(`♫ ${song.title}`, {
        icon: song.album.cover,
        body: `${song.album.name} – ${song.artist.name}`
      })

      notif.onclick = () => KOEL_ENV === 'app' ? mainWin.focus() : window.focus()

      window.setTimeout(() => notif.close(), 5000)
    } catch (e) {
      // Notification fails.
      // @link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    }

    if (isMediaSessionSupported) {
      /* global MediaMetadata */
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist.name,
        album: song.album.name,
        artwork: [
          { src: song.album.cover, sizes: '256x256', type: 'image/png' }
        ]
      })
    }
  },

  restart () {
    const song = queueStore.current

    this.showNotification(song)

    // Record the UNIX timestamp the song start playing, for scrobbling purpose
    song.playStartTime = Math.floor(Date.now() / 1000)

    song.registeredPlayCount = false

    event.emit(event.$names.SONG_PLAYED, song)

    socket.broadcast(event.$names.SOCKET_SONG, songStore.generateDataToBroadcast(song))

    this.player.restart()
    this.player.play()
  },

  /**
   * The next song in the queue.
   * If we're in REPEAT_ALL mode and there's no next song, just get the first song.
   *
   * @return {Object} The song
   */
  get next () {
    if (queueStore.next) {
      return queueStore.next
    }

    if (preferences.repeatMode === 'REPEAT_ALL') {
      return queueStore.first
    }
  },

  /**
   * The previous song in the queue.
   * If we're in REPEAT_ALL mode and there's no prev song, get the last song.
   *
   * @return {Object} The song
   */
  get previous () {
    if (queueStore.previous) {
      return queueStore.previous
    }

    if (preferences.repeatMode === 'REPEAT_ALL') {
      return queueStore.last
    }
  },

  /**
   * Circle through the repeat mode.
   * The selected mode will be stored into local storage as well.
   */
  changeRepeatMode () {
    let index = this.repeatModes.indexOf(preferences.repeatMode) + 1

    if (index >= this.repeatModes.length) {
      index = 0
    }

    preferences.repeatMode = this.repeatModes[index]
  },

  /**
   * Play the prev song in the queue, if one is found.
   * If the prev song is not found and the current mode is NO_REPEAT, we stop completely.
   */
  playPrev () {
    // If the song's duration is greater than 5 seconds and we've passed 5 seconds into it,
    // restart playing instead.
    if (this.player.media.currentTime > 5 && queueStore.current.length > 5) {
      this.player.restart()

      return
    }

    const prev = this.previous
    !prev && preferences.repeatMode === 'NO_REPEAT'
      ? this.stop()
      : this.play(prev)
  },

  /**
   * Play the next song in the queue, if one is found.
   * If the next song is not found and the current mode is NO_REPEAT, we stop completely.
   */
  playNext () {
    const next = this.next
    !next && preferences.repeatMode === 'NO_REPEAT'
      ? this.stop() //  Nothing lasts forever, even cold November rain.
      : this.play(next)
  },

  /**
   * Rewind current song
   *
   * @param {Number} seconds   0-999
   */
  playRewind (seconds) {
    this.player.rewind(seconds)
  },

  /**
   * Forward current song
   *
   * @param {Number} seconds   0-999
   */
  playForward (seconds) {
    this.player.forward(seconds)
  },

  /**
   * @param {Number}     volume   0-10
   * @param {Boolean=true}   persist  Whether the volume should be saved into local storage
   */
  setVolume (volume, persist = true) {
    this.player.setVolume(volume)

    if (persist) {
      preferences.volume = volume
    }

    this.volumeInput.value = volume
  },

  mute () {
    this.setVolume(0, false)
  },

  unmute () {
    // If the saved volume is 0, we unmute to the default level (7).
    if (preferences.volume === '0' || preferences.volume === 0) {
      preferences.volume = 7
    }

    this.setVolume(preferences.volume)
  },

  stop () {
    document.title = app.name
    this.player.pause()
    this.player.seek(0)

    if (queueStore.current) {
      queueStore.current.playbackState = 'stopped'
    }

    socket.broadcast(event.$names.SOCKET_PLAYBACK_STOPPED)
  },

  pause () {
    this.player.pause()
    queueStore.current.playbackState = 'paused'
    socket.broadcast(event.$names.SOCKET_SONG, songStore.generateDataToBroadcast(queueStore.current))
  },

  resume () {
    this.player.play()
    queueStore.current.playbackState = 'playing'
    event.emit(event.$names.SONG_PLAYED, queueStore.current)
    socket.broadcast(event.$names.SOCKET_SONG, songStore.generateDataToBroadcast(queueStore.current))
  },

  toggle () {
    if (!queueStore.current) {
      this.playFirstInQueue()
      return
    }

    if (queueStore.current.playbackState !== 'playing') {
      this.resume()
      return
    }

    this.pause()
  },

  /**
   * Queue up songs (replace them into the queue) and start playing right away.
   *
   * @param {?Array.<Object>} songs  An array of song objects. Defaults to all songs if null.
   * @param {Boolean=false}   shuffled Whether to shuffle the songs before playing.
   */
  queueAndPlay (songs = null, shuffled = false) {
    if (!songs) {
      songs = shuffle(songStore.all)
    }

    if (!songs.length) {
      return
    }

    if (shuffled) {
      songs = shuffle(songs)
    }

    queueStore.replaceQueueWith(songs)

    // Wrap this inside a nextTick() to wait for the DOM to complete updating
    // and then play the first song in the queue.
    Vue.nextTick(() => {
      router.go('queue')
      this.play(queueStore.first)
    })
  },

  /**
   * Play the first song in the queue.
   * If the current queue is empty, try creating it by shuffling all songs.
   */
  playFirstInQueue () {
    queueStore.all.length ? this.play(queueStore.first) : this.queueAndPlay()
  },

  playAllByArtist ({ songs }, shuffled = true) {
    shuffled
      ? this.queueAndPlay(songs, true /* shuffled */)
      : this.queueAndPlay(orderBy(songs, ['album_id', 'disc', 'track']))
  },

  playAllInAlbum ({ songs }, shuffled = true) {
    shuffled
      ? this.queueAndPlay(songs, true /* shuffled */)
      : this.queueAndPlay(orderBy(songs, ['disc', 'track']))
  }
}
