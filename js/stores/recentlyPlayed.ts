import NProgress from 'nprogress'
import { songStore } from '.'
import { http } from '../services'
import { remove } from 'lodash'

const EXCERPT_COUNT = 7

export const recentlyPlayedStore = {
  excerptState: {
    songs: []
  },

  state: {
    songs: []
  },

  fetched: false,

  initExcerpt (songIds) {
    this.excerptState.songs = songStore.byIds(songIds)
  },

  fetchAll () {
    NProgress.start()

    return new Promise((resolve, reject) => {
      if (this.fetched) {
        resolve(this.state.songs)
        return
      }

      http.get(`interaction/recently-played`, ({ data }) => {
        this.state.songs = songStore.byIds(data)
        resolve(this.state.songs)
      }, error => reject(error))
    })
  },

  add (song) {
    [this.state, this.excerptState].forEach(state => {
      // make sure there's no duplicate
      remove(state.songs, s => s.id === song.id)
      state.songs.unshift(song)
    })

    this.excerptState.songs.splice(EXCERPT_COUNT)
  }
}
