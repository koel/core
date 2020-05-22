import { songStore } from '.'
import { http } from '../services'
import { remove } from 'lodash'

interface RecentlyPlayedStore {
  excerptState: {
    songs: Song[]
  }
  state: {
    songs: Song[]
  }
  fetched: boolean

  initExcerpt(songIds: string[]): void
  fetchAll(): Promise<Song[]>
  add(song: Song): void
}

const EXCERPT_COUNT = 7

export const recentlyPlayedStore: RecentlyPlayedStore = {
  excerptState: {
    songs: []
  },

  state: {
    songs: []
  },

  fetched: false,

  initExcerpt (songIds): void {
    this.excerptState.songs = songStore.byIds(songIds)
  },

  fetchAll (): Promise<Song[]> {
    return new Promise((resolve, reject): void => {
      if (this.fetched) {
        resolve(this.state.songs)
        return
      }

      http.get(`interaction/recently-played`, ({ data }: { data: string[] }): void => {
        this.state.songs = songStore.byIds(data)
        resolve(this.state.songs)
      }, (error: any) => reject(error))
    })
  },

  add (song: Song): void {
    [this.state, this.excerptState].forEach((state): void => {
      // make sure there's no duplicate
      remove(state.songs, s => s.id === song.id)
      state.songs.unshift(song)
    })

    this.excerptState.songs.splice(EXCERPT_COUNT)
  }
}
