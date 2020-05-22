/* eslint camelcase: ["error", {properties: "never"}] */

import Vue from 'vue'
import { union, difference, take, orderBy } from 'lodash'

import stub from '@/stubs/album'
import { artistStore } from '.'
import { http } from '@/services'

interface AlbumStore {
  stub: Album
  cache: { [id: number]: Album }
  state: {
    albums: Album[]
  }
  all: Album[]

  init(albums: Album[]): void
  setupAlbum(album: Album, artist?: Artist): void
  byId(id: number): Album
  add(album: Album | Album[]): void
  purify(): void
  compact(): void
  getMostPlayed(n: number): Album[]
  getRecentlyAdded(n: number): Album[]
  uploadCover(album: Album, cover: string): Promise<string>
}

export const albumStore: AlbumStore = {
  stub,
  cache: {},

  state: {
    albums: [stub]
  },

  init (albums: Album[]) {
    // Traverse through the artists array and add their albums into our master album list.
    this.all = albums
    this.all.forEach(album => this.setupAlbum(album))
  },

  setupAlbum (album: Album): void {
    const artist = artistStore.byId(album.artist_id)
    artist.albums = union(artist.albums, [album])

    Vue.set(album, 'artist', artist)
    Vue.set(album, 'info', null)
    Vue.set(album, 'songs', [])
    Vue.set(album, 'playCount', 0)

    this.cache[album.id] = album
  },

  get all () {
    return this.state.albums
  },

  set all (value) {
    this.state.albums = value
  },

  byId (id: number): Album {
    return this.cache[id]
  },

  add (albums: Album | Album[]): void {
    (<Album[]>[]).concat(albums).forEach(album => {
      this.setupAlbum(album, album.artist)
      album.playCount = album.songs.reduce((count, song) => count + song.playCount, 0)
    })

    this.all = union(this.all, <Album[]>albums)
  },

  purify (): void {
    this.compact()
  },

  /**
   * Remove empty albums from the store.
   */
  compact (): void {
    const emptyAlbums = this.all.filter(album => album.songs.length === 0)
    if (!emptyAlbums.length) {
      return
    }

    this.all = difference(this.all, emptyAlbums)
    emptyAlbums.forEach(album => delete this.cache[album.id])
  },

  getMostPlayed (n: number = 6): Album[] {
    // Only non-unknown albums with actual play count are applicable.
    const applicable = this.all.filter(album => album.playCount && album.id !== 1)
    return take(orderBy(applicable, 'playCount', 'desc'), n)
  },

  getRecentlyAdded (n: number = 6): Album[] {
    const applicable = this.all.filter(album => album.id !== 1)
    return take(orderBy(applicable, 'created_at', 'desc'), n)
  },

  /**
   * Upload a cover for an album.
   *
   * @param {Album} album The album object
   * @param {string} cover The content data string of the cover
   */
  uploadCover: (album: Album, cover: string): Promise<string> => new Promise((resolve, reject): void => {
    http.put(`album/${album.id}/cover`, { cover }, ({ data: { coverUrl } }: { data: { coverUrl: string }}): void => {
      album.cover = coverUrl
      resolve(coverUrl)
    }, (error: any) => reject(error))
  })
}
