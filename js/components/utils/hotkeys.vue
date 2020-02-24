<template>
  <global-events
    @keydown.space = "togglePlayback"
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
let listenToGlobalShortcuts = () => {}

if (KOEL_ENV === 'app') {
  listenToGlobalShortcuts = () => {
    const mediaFunctionMap = {
      MediaNextTrack: () => playback.playNext(),
      MediaPreviousTrack: () => playback.playPrev(),
      MediaStop: () => playback.stop(),
      MediaPlayPause: () => playback.toggle()
    }

    ipc.on(events.GLOBAL_SHORTCUT, (e, msg) => msg in mediaFunctionMap && mediaFunctionMap[msg]())
  }
}

export default {
  methods: {
    /**
     * Toggle playback when user presses Space key.
     *
     * @param {Object} e The keydown event
     */
    togglePlayback: e => {
      if (e && $.is(e.target, 'input, textarea, button, select') && !$.is(e.target, 'input[type=range]')) {
        return true
      }

      playback.toggle()
      e && e.preventDefault()
    },

    /**
     * Play the previous song when user presses K.
     *
     * @param {Object} e The keydown event
     */
    playPrev: e => {
      if ($.is(e.target, 'input, select, textarea')) {
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
      if ($.is(e.target, 'input, select, textarea')) {
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
      if (($.is(e.target, 'input, select, textarea') && !$.is(e.target, 'input[type=range]')) || e.metaKey || e.ctrlKey) {
        return true
      }

      e.preventDefault()
      event.emit(event.$names.FOCUS_SEARCH_FIELD)
    },

    /**
     * Like/unlike the current song when use presses L.
     */
    toggleLike: e => {
      if ($.is(e.target, 'input, select, textarea')) {
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
