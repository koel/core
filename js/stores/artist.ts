/* eslint camelcase: ["error", {properties: "never"}] */

import Vue from 'vue'
import { union, difference, take, orderBy } from 'lodash'

import { http } from '@/services'
import stub from '@/stubs/artist'

interface ArtistStore {
  stub: Artist
  cache: { [id: number]: Artist }
  state: {
    artists: Artist[]
  }
  all: Artist[]

  init(artists: Artist[]): void
  setupArtist(artist: Artist): void
  byId(id: number): Artist
  add(artists: Artist | Artist[]): void
  compact(): void
  purify(): void
  isUnknownArtist(artist: Artist): boolean
  isVariousArtists(artist: Artist): boolean
  getSongsByArtist(artist: Artist): Song[]
  getMostPlayed(n: number): Artist[]
  uploadImage(artist: Artist, image: string): Promise<string>
}

const UNKNOWN_ARTIST_ID = 1
const VARIOUS_ARTISTS_ID = 2

export const artistStore: ArtistStore = {
  stub,
  cache: [],

  state: {
    artists: []
  },

  init (artists: Artist[]): void {
    this.all = artists

    // Traverse through artists array to get the cover and number of songs for each.
    this.all.forEach(artist => this.setupArtist(artist))
  },

  setupArtist (artist: Artist): void {
    Vue.set(artist, 'playCount', 0)
    Vue.set(artist, 'info', null)
    Vue.set(artist, 'albums', [])
    Vue.set(artist, 'songs', [])

    this.cache[artist.id] = artist
  },

  get all () {
    return this.state.artists
  },

  set all (value) {
    this.state.artists = value
  },

  byId (id: number): Artist {
    return this.cache[id]
  },

  add (artists: Artist | Artist[]) {
    (<Artist[]>[]).concat(artists).forEach(artist => {
      this.setupArtist(artist)
      artist.playCount = artist.songs.reduce((count, song) => count + song.playCount, 0)
    })

    this.all = union(this.all, <Artist[]>artists)
  },

  purify (): void {
    this.compact()
  },

  /**
   * Remove empty artists from the store.
   */
  compact (): void {
    const emptyArtists = this.all.filter(artist => artist.songs.length === 0)

    if (!emptyArtists.length) {
      return
    }

    this.all = difference(this.all, emptyArtists)
    emptyArtists.forEach(artist => delete this.cache[artist.id])
  },

  isVariousArtists: (artist: Artist) => artist.id === VARIOUS_ARTISTS_ID,

  isUnknownArtist: (artist: Artist) => artist.id === UNKNOWN_ARTIST_ID,

  getSongsByArtist: (artist: Artist) => artist.songs,

  getMostPlayed (n: number = 6): Artist[] {
    // Only non-unknown artists with actual play count are applicable.
    // Also, "Various Artists" doesn't count.
    const applicable = this.all.filter(artist => {
      return artist.playCount &&
        !this.isUnknownArtist(artist) &&
        !this.isVariousArtists(artist)
    })

    return take(orderBy(applicable, 'playCount', 'desc'), n)
  },

  /**
   * Upload an image for an artist.
   *
   * @param {Artist} artist The artist object
   * @param {string} image The content data string of the image
   */
  uploadImage: (artist: Artist, image: string): Promise<string> => new Promise((resolve, reject) => {
    http.put(`artist/${artist.id}/image`, { image }, ({ data: { imageUrl }} : { data: { imageUrl: string }}): void => {
      artist.image = imageUrl
      resolve(imageUrl)
    }, (error: any) => reject(error))
  })
}
