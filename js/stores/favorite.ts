import { difference, union } from 'lodash'
import NProgress from 'nprogress'

import { http } from '@/services'
import { alerts, pluralize } from '@/utils'

interface FavoriteStore {
  state: {
    songs: Song[]
    length: number
    fmtLength: string
  }
  all: Song[],

  toggleOne(song: Song): Promise<Song>
  add(songs: Song | Song[]): void
  remove(songs: Song | Song[]): void
  clear(): void
  like(songs: Song[]): Promise<Song[]>
  unlike(songs: Song[]): Promise<Song[]>
}

export const favoriteStore: FavoriteStore = {
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

  toggleOne (song: Song): Promise<Song> {
    // Don't wait for the HTTP response to update the status, just toggle right away.
    // This may cause a minor problem if the request fails somehow, but do we care?
    song.liked = !song.liked
    song.liked ? this.add(song) : this.remove(song)

    return new Promise((resolve, reject) => {
      http.post('interaction/like', { song: song.id }, ({ data } : { data: Song }) => {
        // We don't really need to notify just for one song.
        resolve(data)
      }, (error: any) => reject(error))
    })
  },

  /**
   * Add a song/songs into the store.
   */
  add (songs: Song | Song[]): void {
    this.all = union(this.all, ([] as Song[]).concat(songs))
  },

  /**
   * Remove a song/songs from the store.
   */
  remove (songs: Song | Song[]): void {
    this.all = difference(this.all, ([] as Song[]).concat(songs))
  },

  clear (): void {
    this.all = []
  },

  like (songs: Song[]): Promise<Song[]> {
    // Don't wait for the HTTP response to update the status, just set them to Liked right away.
    // This may cause a minor problem if the request fails somehow, but do we care?
    songs.forEach(song => { song.liked = true })
    this.add(songs)

    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.post('interaction/batch/like', {
        songs: songs.map(song => song.id)
      }, ({ data } : { data: Song[] }): void => {
        alerts.success(`Added ${pluralize(songs.length, 'song')} into Favorites.`)
        resolve(data)
      }, (error: any) => reject(error))
    })
  },

  unlike (songs: Song[]): Promise<Song[]> {
    songs.forEach(song => { song.liked = false })
    this.remove(songs)

    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.post('interaction/batch/unlike', {
        songs: songs.map(song => song.id)
      }, ({ data } : { data: Song[] }): void => {
        alerts.success(`Removed ${pluralize(songs.length, 'song')} from Favorites.`)
        resolve(data)
      }, (error: any) => reject(error))
    })
  }
}
