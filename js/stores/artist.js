/* eslint camelcase: ["error", {properties: "never"}] */

import Vue from 'vue'
import { union, difference, take, orderBy } from 'lodash'

import stub from '@/stubs/artist'

const UNKNOWN_ARTIST_ID = 1
const VARIOUS_ARTISTS_ID = 2

export const artistStore = {
  stub,
  cache: [],

  state: {
    artists: []
  },

  init (artists) {
    this.all = artists

    // Traverse through artists array to get the cover and number of songs for each.
    this.all.forEach(artist => this.setupArtist(artist))
  },

  setupArtist (artist) {
    Vue.set(artist, 'playCount', 0)
    Vue.set(artist, 'info', null)
    Vue.set(artist, 'albums', [])
    Vue.set(artist, 'songs', [])

    this.cache[artist.id] = artist

    return artist
  },

  get all () {
    return this.state.artists
  },

  set all (value) {
    this.state.artists = value
  },

  byId (id) {
    return this.cache[id]
  },

  /**
   * Adds an artist/artists into the current collection.
   *
   * @param  {Array.<Object>|Object} artists
   */
  add (artists) {
    [].concat(artists).forEach(artist => {
      this.setupArtist(artist)
      artist.playCount = artist.songs.reduce((count, song) => count + song.playCount, 0)
    })

    this.all = union(this.all, artists)
  },

  purify () {
    this.compact()
  },

  /**
   * Remove empty artists from the store.
   */
  compact () {
    const emptyArtists = this.all.filter(artist => artist.songs.length === 0)
    if (!emptyArtists.length) {
      return
    }

    this.all = difference(this.all, emptyArtists)
    emptyArtists.forEach(artist => delete this.cache[artist.id])
  },

  isVariousArtists: artist => artist.id === VARIOUS_ARTISTS_ID,

  isUnknownArtist: artist => artist.id === UNKNOWN_ARTIST_ID,

  getSongsByArtist: artist => artist.songs,

  getMostPlayed (n = 6) {
    // Only non-unknown artists with actually play count are applicable.
    // Also, "Various Artists" doesn't count.
    const applicable = this.all.filter(artist => {
      return artist.playCount &&
        !this.isUnknownArtist(artist) &&
        !this.isVariousArtists(artist)
    })

    return take(orderBy(applicable, 'playCount', 'desc'), n)
  }
}
