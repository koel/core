declare module 'vue-virtual-scroller/dist/vue-virtual-scroller' {
  const VirtualScroller: any
  export { VirtualScroller }
}

declare module 'vue-global-events' {
  export default any
}

declare module '@phanan/vuebus' {
  function emit(eventName: string, ...data: any[]): void
  function on(eventName: string, handler: Function): void
  function on(handlers: { [key: string]: Function }): void
  const $names: { [key: string]: string }
}

declare module 'alertify.js' {
  function alert(msg: string): void
  function confirm(msg: string, okFunc: Function, cancelFunc?: Function): void
  function success(msg: string, cb?: Function): void
  function error(msg: string, cb?: Function): void
  function log(msg: string, cb?: Function): void
  function logPosition(position: string): void
  function closeLogOnClick(close: boolean): void
}

declare module 'select' {
  function select(el: HTMLElement): void
  export default select
}

declare module 'sketch-js' {
  function create(o: { [key: string]: any }): any
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
  function setup(el: HTMLMediaElement | HTMLMediaElement[], options: object): Plyr[]
}

declare module 'ismobilejs' {
  const apple: { device: boolean }
  const any: boolean
  const phone: boolean
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
  readonly BASE_URL: string
  __UNIT_TESTING__: boolean
  readonly PUSHER_APP_KEY: string
  readonly PUSHER_APP_CLUSTER: string
  readonly webkitAudioContext: Constructable<AudioContext>
  readonly mozAudioContext: Constructable<AudioContext>
  readonly oAudioContext: Constructable<AudioContext>
  readonly msAudioContext: Constructable<AudioContext>
  readonly MediaMetadata: Constructable<object>
}

interface Artist {
  readonly id: number
  name: string
  image: string
  albums: Album[]
  songs: Song[]
  info: ArtistInfo | null
  playCount: number
  length: number
  fmtLength: string
}

interface Album {
  is_compilation: any
  readonly id: number
  artist_id: number
  artist: Artist
  name: string
  cover: string
  songs: Song[]
  info: AlbumInfo | null
  playCount: number
  length: number
  fmtLength: string
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
  youtube: object,
  playCountRegistered: boolean
  preloaded: boolean
  playbackState: string
  infoRetrieved: boolean
  playCount: number
  liked: boolean
  playStartTime: number
  fmtLength: string
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

interface SmartPlaylistRule extends Object {}

interface Playlist {
  readonly id: number
  name: string
  songs: Song[]
  populated: boolean
  is_smart: boolean
  rules: SmartPlaylistRule[]
}

interface Video {
  readonly id: {
    videoId: string
  }

  readonly snippet: {
    title: string
  }
}

interface User {
  readonly id: number
  name: string
  email: string
  password: string
  readonly is_admin: boolean
  preferences: { [key: string]: any }
  avatar: string
}

interface Settings extends Object {
  media_path?: string
}

interface Interaction {
  readonly song_id: string
  liked: boolean
  play_count: number
}
