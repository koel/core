import Vue from 'vue'
import slugify from 'slugify'
import { without, take, remove, orderBy, unionBy } from 'lodash'
import isMobile from 'ismobilejs'

import { secondsToHis, alerts, pluralize } from '@/utils'
import { http, ls } from '@/services'
import { sharedStore, favoriteStore, albumStore, artistStore, preferenceStore } from '.'
import stub from '@/stubs/song'

interface BroadcastedSongData {
  song: {
    id: string
    title: string
    liked: boolean
    playbackState: PlaybackState
    album: {
      name: string
      cover: string
    }
    artist: {
      name: string
    }
  }
}

interface SongStore {
  stub: Song
  albums: Album[]
  cache: { [id: string]: Song }
  state: {
    songs: Song[]
    recentlyPlayed: Song[]
  }
  all: Song[]
  recentlyPlayed: Song[]

  init(songs: Song[]): void
  setupSong(song: Song): void
  byId(id: string): Song
  byIds(ids: string[]): Song[]
  initInteractions(interactions: Interaction[]): void
  getLength(songs: Song[], formatted: boolean): number|string
  getFormattedLength(songs: Song[]): string
  guess(title: string, album: Album): Song | null
  registerPlay(song: Song): Promise<Interaction>
  scrobble(song: Song): Promise<any>
  update(songs: Song[], data: Object): Promise<Song[]>
  getSourceUrl(song: Song): string
  getShareableUrl(song: Song): string
  getMostPlayed(n: number): Song[]
  getRecentlyAdded(n: number): Song[]
  generateDataToBroadcast(song: Song): BroadcastedSongData
}

export const songStore: SongStore = {
  stub,
  albums: [],
  cache: {},

  state: {
    songs: [stub],
    recentlyPlayed: []
  },

  init (songs: Song[]): void {
    this.all = songs
    this.all.forEach(song => this.setupSong(song))
  },

  setupSong (song: Song): void {
    song.fmtLength = secondsToHis(song.length)

    const album = albumStore.byId(song.album_id)
    const artist = artistStore.byId(song.artist_id)

    // Manually set these additional properties to be reactive
    Vue.set(song, 'playCount', song.playCount || 0)
    Vue.set(song, 'album', album)
    Vue.set(song, 'artist', artist)
    Vue.set(song, 'liked', song.liked || false)
    Vue.set(song, 'lyrics', song.lyrics || null)
    Vue.set(song, 'playbackState', song.playbackState || 'Stopped')

    artist.songs = unionBy(artist.songs || [], [song], 'id')
    album.songs = unionBy(album.songs || [], [song], 'id')

    // now if the song is part of a compilation album, the album must be added
    // into its artist as well
    if (album.is_compilation) {
      artist.albums = unionBy(artist.albums, [album], 'id')
    }

    // Cache the song, so that byId() is faster
    this.cache[song.id] = song
  },

  /**
   * Initializes the interaction (like/play count) information.
   *
   * @param  {Interaction[]} interactions The array of interactions of the current user
   */
  initInteractions (interactions: Interaction[]): void {
    favoriteStore.clear()

    interactions.forEach(interaction => {
      const song = this.byId(interaction.song_id)

      if (!song) {
        return
      }

      song.liked = interaction.liked
      song.playCount = interaction.play_count
      song.album.playCount += song.playCount
      song.artist.playCount += song.playCount

      song.liked && favoriteStore.add(song)
    })
  },

  /**
   * Get the total duration of some songs.
   *
   * @param {Boolean} formatted Whether to convert the duration into H:i:s format
   */
  getLength: (songs: Song[], formatted: boolean = false): number | string => {
    const duration = songs.reduce((length, song) => length + song.length, 0)

    return formatted ? secondsToHis(duration) : duration
  },

  getFormattedLength (songs: Song[]): string {
    return <string>this.getLength(songs, true)
  },

  get all () {
    return this.state.songs
  },

  set all (value: Song[]) {
    this.state.songs = value
  },

  byId (id: string) {
    return this.cache[id]
  },

  byIds (ids: string[]) {
    return ids.map(id => this.byId(id))
  },

  /**
   * Guess a song by its title and album.
   * Forget about Levenshtein distance, this implementation is good enough.
   */
  guess: (title: string, album: Album): Song | null => {
    title = slugify(title.toLowerCase())

    for (let song of album.songs) {
      if (slugify(song.title.toLowerCase()) === title) {
        return song
      }
    }

    return null
  },

  /**
   * Increase a play count for a song.
   */
  registerPlay: (song: Song): Promise<Interaction> => {
    return new Promise((resolve, reject): void => {
      const oldCount = song.playCount

      http.post('interaction/play', { song: song.id }, ({ data }: { data: Interaction }): void => {
        // Use the data from the server to make sure we don't miss a play from another device.
        song.playCount = data.play_count
        song.album.playCount += song.playCount - oldCount
        song.artist.playCount += song.playCount - oldCount

        resolve(data)
      }, (error: any) => reject(error))
    })
  },

  scrobble: (song: Song): Promise<any> => {
    return new Promise((resolve, reject): void => {
      http.post(`${song.id}/scrobble/${song.playStartTime}`, {}, (): void => {
        resolve()
      }, (error: any) => reject(error))
    })
  },

  update (songs: Song[], data: any): Promise<Song[]> {
    return new Promise((resolve, reject) => {
      http.put('songs', {
        data,
        songs: songs.map(song => song.id)
      }, ({ data: { songs, artists, albums }}: { data: { songs: Song[], artists: Artist[], albums: Album[] }}) => {
        // Add the artist and album into stores if they're new
        artists.forEach(artist => !artistStore.byId(artist.id) && artistStore.add(artist))
        albums.forEach(album => !albumStore.byId(album.id) && albumStore.add(album))

        songs.forEach(song => {
          let originalSong = this.byId(song.id)

          if (originalSong.album_id !== song.album_id) {
            // album has been changed. Remove the song from its old album.
            originalSong.album.songs = without(originalSong.album.songs, originalSong)
          }

          if (originalSong.artist_id !== song.artist_id) {
            // artist has been changed. Remove the song from its old artist
            originalSong.artist.songs = without(originalSong.artist.songs, originalSong)
          }

          originalSong = Object.assign(originalSong, song)
          // re-setup the song
          this.setupSong(originalSong)
        })

        artistStore.compact()
        albumStore.compact()

        alerts.success(`Updated ${pluralize(songs.length, 'song')}.`)
        resolve(songs)
      }, (error: any) => reject(error))
    })
  },

  getSourceUrl: (song: Song): string => {
    if (isMobile.any && preferenceStore.transcodeOnMobile) {
      return `${sharedStore.state.cdnUrl}api/${song.id}/play/1/128?jwt-token=${ls.get('jwt-token')}`
    }
    return `${sharedStore.state.cdnUrl}api/${song.id}/play?jwt-token=${ls.get('jwt-token')}`
  },

  getShareableUrl: (song: Song): string => {
    const baseUrl = KOEL_ENV === 'app' ? ls.get('koelHost') : window.BASE_URL
    return `${baseUrl}#!/song/${song.id}`
  },

  get recentlyPlayed () {
    return this.state.recentlyPlayed
  },

  getMostPlayed (n = 10): Song[] {
    const songs = take(orderBy(this.all, 'playCount', 'desc'), n)

    // Remove those with playCount=0
    remove(songs, song => !song.playCount)

    return songs
  },

  getRecentlyAdded (n = 10) {
    return take(orderBy(this.all, 'created_at', 'desc'), n)
  },

  generateDataToBroadcast: (song: Song): BroadcastedSongData => ({
    song: {
      id: song.id,
      title: song.title,
      liked: song.liked,
      playbackState: song.playbackState || 'Stopped',
      album: {
        name: song.album.name,
        cover: song.album.cover
      },
      artist: {
        name: song.artist.name
      }
    }
  })
}
