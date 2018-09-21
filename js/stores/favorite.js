import { difference, union } from 'lodash'
import NProgress from 'nprogress'

import { http } from '@/services'
import { alerts, pluralize } from '@/utils'

export const favoriteStore = {
  state: {
    songs: [],
    length: 0,
    fmtLength: ''
  },

  get all () {
    return this.state.songs
  },

  set all (value) {
    this.state.songs = value
  },

  toggleOne (song) {
    // Don't wait for the HTTP response to update the status, just toggle right away.
    // This may cause a minor problem if the request fails somehow, but do we care?
    song.liked = !song.liked
    song.liked ? this.add(song) : this.remove(song)

    NProgress.start()

    return new Promise((resolve, reject) => {
      http.post('interaction/like', { song: song.id }, ({ data }) => {
        // We don't really need to notify just for one song.
        resolve(data)
      }, error => reject(error))
    })
  },

  /**
   * Add a song/songs into the store.
   *
   * @param {Array.<Object>|Object} songs
   */
  add (songs) {
    this.all = union(this.all, [].concat(songs))
  },

  /**
   * Remove a song/songs from the store.
   *
   * @param {Array.<Object>|Object} songs
   */
  remove (songs) {
    this.all = difference(this.all, [].concat(songs))
  },

  clear () {
    this.all = []
  },

  like (songs) {
    // Don't wait for the HTTP response to update the status, just set them to Liked right away.
    // This may cause a minor problem if the request fails somehow, but do we care?
    songs.forEach(song => { song.liked = true })
    this.add(songs)

    NProgress.start()

    return new Promise((resolve, reject) => {
      http.post('interaction/batch/like', { songs: songs.map(song => song.id) }, ({ data }) => {
        alerts.success(`Added ${pluralize(songs.length, 'song')} into Favorites.`)
        resolve(data)
      }, error => reject(error))
    })
  },

  unlike (songs) {
    songs.forEach(song => { song.liked = false })
    this.remove(songs)

    NProgress.start()

    return new Promise((resolve, reject) => {
      http.post('interaction/batch/unlike', { songs: songs.map(song => song.id) }, ({ data }) => {
        alerts.success(`Removed ${pluralize(songs.length, 'song')} from Favorites.`)
        resolve(data)
      }, error => reject(error))
    })
  }
}
