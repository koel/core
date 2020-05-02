declare module 'vue-virtual-scroller/dist/vue-virtual-scroller' {
  const VirtualScroller: any
  export { VirtualScroller }
}

declare module 'vue-global-events' {
  export default any
}

declare module '@phanan/vuebus' {
  import Vue, { VNode } from 'vue'
  export default Vue
}

declare module 'alertify.js' {
  function alert(msg: string): void
  function confirm(msg: string, okFunc: Function, cancelFunc: Function | null): void
  function success(msg: string, cb: Function | null): void
  function error(msg: string, cb: Function | null): void
  function log(msg: string, cb: Function | null): void
  function logPosition(position: string): void
  function closeLogOnClick(close: boolean): void
}

declare module 'select' {
  function select(el: HTMLElement): void
  export default select
}

interface Plyr {
  media: HTMLMediaElement
  restart(): void
  play(): void
  pause(): void
  seek(position: number): void
  setVolume(volume: number): void
}

declare module 'plyr' {
  function setup(el: HTMLMediaElement | HTMLMediaElement[], options: Object): Plyr[]
}

declare const KOEL_ENV: string

declare module '*.vue' {
  import Vue, { VNode } from 'vue'
  export default Vue
}

interface Constructable<T> {
  new(...args: any) : T
}

interface Window {
  BASE_URL: string
  __UNIT_TESTING__: boolean
  PUSHER_APP_KEY: string
  PUSHER_APP_CLUSTER: string
  webkitAudioContext: Constructable<AudioContext>
  mozAudioContext: Constructable<AudioContext>
  oAudioContext: Constructable<AudioContext>
  msAudioContext: Constructable<AudioContext>
  MediaMetadata: Constructable<Object>
}

interface Artist {
  readonly id: number
  name: string
  image: string
  albums: Album[]
  songs: Song[]
  info: ArtistInfo | null
  playCount: number
}

interface Album {
  readonly id: number
  artist_id: number
  artist: Artist
  name: string
  cover: string
  songs: Song[]
  info: AlbumInfo | null
  playCount: number
}

interface Song {
  readonly id: string
  album_id: number
  album: Album
  artist_id: number
  artist: Artist
  title: string
  readonly length: number
  track: number
  disc: number
  lyrics: string
  youtube: JSON,
  playCountRegistered: boolean
  preloaded: boolean
  playbackState: string
  infoRetrieved: boolean
  playCount: number
  liked: boolean
}

interface AlbumInfo {
  image: string | null
  readonly tracks: AlbumTrack[]
}

interface AlbumTrack {
  readonly title: string
  readonly length: number
  fmtLength: string
}

interface ArtistInfo {
  image: string | null
}

interface Playlist {
  id: number
  name: string
  songs: Song[]
}

interface Video {
  id: {
    videoId: string
  }

  snippet: {
    title: string
  }
}

interface User {
  id: number
  name: string
  email: string
  is_admin: boolean
}
