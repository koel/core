<template>
  <global-events
    @keydown.space="togglePlayback"
    @keydown.j = "playNext"
    @keydown.k = "playPrev"
    @keydown.f = "search"
    @keydown.l = "toggleLike"
    @keydown.mediaPrev = "playPrev"
    @keydown.mediaNext = "playNext"
    @keydown.mediaToggle = "togglePlayback"
  />
</template>

<script>
import Vue from 'vue'
import { $, event } from '@/utils'
import { playback, socket } from '@/services'
import { queueStore, favoriteStore, songStore } from '@/stores'

let ipc, events

if (KOEL_ENV === 'app') {
  ipc = require('electron').ipcRenderer
  events = require('&/events').default
}

// Register our custom key codes
Vue.config.keyCodes = {
  a: 65,
  j: 74,
  k: 75,
  f: 70,
  l: 76,
  mediaNext: 176,
  mediaPrev: 177,
  mediaToggle: 179
}

/**
 * Listen to the global shortcuts (media keys).
 * Only works in the app.
 */
const listenToGlobalShortcuts = () => {
  ipc.on(events.GLOBAL_SHORTCUT, (e, msg) => {
    switch (msg) {
      case 'MediaNextTrack':
        playback.playNext()
        break
      case 'MediaPreviousTrack':
        playback.playPrev()
        break
      case 'MediaStop':
        playback.stop()
        break
      case 'MediaPlayPause':
        const play = document.querySelector('#mainFooter .play')
        play ? play.click() : document.querySelector('#mainFooter .pause').click()
        break
    }
  })
}

export default {
  methods: {
    /**
     * Toggle playback when user presses Space key.
     *
     * @param {Object} e The keydown event
     */
    togglePlayback: e => {
      if (e && $.is(e.target, 'input,textarea,button,select')) {
        return true
      }

      // Whatever play/pause control is there, we blindly click it.
      const play = document.querySelector('#mainFooter .play')
      play ? play.click() : document.querySelector('#mainFooter .pause').click()

      e && e.preventDefault()
    },

    /**
     * Play the previous song when user presses K.
     *
     * @param {Object} e The keydown event
     */
    playPrev: e => {
      if ($.is(e.target, 'input,textarea')) {
        return true
      }

      playback.playPrev()
      e.preventDefault()
    },

    /**
     * Play the next song when user presses J.
     *
     * @param {Object} e The keydown event
     */
    playNext: e => {
      if ($.is(e.target, 'input,textarea')) {
        return true
      }

      playback.playNext()
      e.preventDefault()
    },

    /**
     * Put focus into the search field when user presses F.
     *
     * @param {Object} e The keydown event
     */
    search: e => {
      if ($.is(e.target, 'input,textarea') || e.metaKey || e.ctrlKey) {
        return true
      }

      e.preventDefault()
      event.emit(event.$names.FOCUS_SEARCH_FIELD)
    },

    /**
     * Like/unlike the current song when use presses L.
     */
    toggleLike: e => {
      if ($.is(e.target, 'input,textarea')) {
        return true
      }

      if (!queueStore.current) {
        return
      }

      favoriteStore.toggleOne(queueStore.current)
      socket.broadcast(event.$names.SOCKET_SONG, songStore.generateDataToBroadcast(queueStore.current))
    }
  },

  created: () => KOEL_ENV === 'app' && listenToGlobalShortcuts()
}
</script>
