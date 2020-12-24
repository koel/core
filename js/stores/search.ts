import { http } from '@/services'
import { songStore } from '@/stores/song'
import { albumStore } from '@/stores/album'
import { artistStore } from '@/stores/artist'

interface ExcerptSearchResult {
  albums: Array<{ id: number }>,
  artists: Array<{ id: number }>,
  songs: Array<{ id: string }>
}

export const searchStore = {
  state: {
    excerpt: {
      songs: [] as Song[],
      albums: [] as Album[],
      artists: [] as Artist[]
    }
  },

  excerptSearch (q: string) {
    http.get<{ [key: string]: ExcerptSearchResult }>(`search?q=${q}`).then(({ results }) => {
      this.state.excerpt.songs = songStore.byIds(results.songs.map(song => song.id))
      this.state.excerpt.albums = albumStore.byIds(results.albums.map(album => album.id))
      this.state.excerpt.artists = artistStore.byIds(results.artists.map(artist => artist.id))
    })
  }
}
