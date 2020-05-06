import { difference, union } from 'lodash'
import NProgress from 'nprogress'

import stub from '@/stubs/playlist'
import { http } from '@/services'
import { alerts, pluralize } from '@/utils'
import { songStore } from '.'
import models from '@/config/smart-playlist/models'
import operators from '@/config/smart-playlist/operators'

interface PlaylistStore {
  stub: Playlist
  state: {
    playlists: Playlist[]
  }
  all: Playlist[]

  init(playlists: Playlist[]): void
  setupSmartPlaylist(playlist: Playlist): void
  fetchSongs(playlist: Playlist): Promise<Playlist>
  byId(id: number): Playlist
  populateContent(playlist: Playlist): void
  getSongs(playlist: Playlist): Song[]
  add(playlists: Playlist | Playlist[]): void
  remove(playlists: Playlist | Playlist[]): void
  store(name: string, songs: Song[], rules: SmartPlaylistRuleGroup[]): Promise<Playlist>
  delete(playlist: Playlist): Promise<any>
  addSongs(playlist: Playlist, songs: Song[]): Promise<Playlist>
  removeSongs(playlist: Playlist, songs: Song[]): Promise<Playlist>
  update(playlist: Playlist): Promise<Playlist>
  createEmptySmartPlaylistRule(): SmartPlaylistRule
  createEmptySmartPlaylistRuleGroup(): SmartPlaylistRuleGroup
  serializeSmartPlaylistRulesForStorage(ruleGroups: SmartPlaylistRuleGroup[]): object[] | null
}

export const playlistStore: PlaylistStore = {
  stub,

  state: {
    playlists: []
  },

  init (playlists: Playlist[]) {
    this.all = playlists
    this.all.filter(playlist => playlist.is_smart).forEach(this.setupSmartPlaylist)
  },

  /**
   * Set up a smart playlist by properly construct its structure from serialized database values.
   */
  setupSmartPlaylist: (playlist: Playlist): void => {
    playlist.rules.forEach(group => {
      group.rules.forEach(rule => {
        const model = models.find(model => model.name === rule.model as unknown as string)

        if (!model) {
          /* eslint no-console: 0 */
          console.error(`Invalid model ${rule.model} found in smart playlist ${playlist.name} (ID ${playlist.id})`)
          return
        }

        rule.model = model
      })
    })
  },

  get all () {
    return this.state.playlists
  },

  set all (value) {
    this.state.playlists = value
  },

  fetchSongs: (playlist: Playlist): Promise<Playlist> => {
    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.get(`playlist/${playlist.id}/songs`, ({ data }: { data: string[] }) => {
        playlist.songs = songStore.byIds(data)
        playlist.populated = true
        resolve(playlist)
      }, (error: any) => reject(error))
    })
  },

  byId (id: number): Playlist {
    return <Playlist>this.all.find(song => song.id === id)
  },

  /**
   * Populate the playlist content by "objectifying" all songs in the playlist.
   * (Initially, a playlist only contain the song IDs).
   */
  populateContent: (playlist: Playlist): void => {
    playlist.songs = songStore.byIds(<string[]><unknown>playlist.songs)
  },

  getSongs: (playlist: Playlist): Song[] => playlist.songs,

  /**
   * Add a playlist/playlists into the store.
   */
  add (playlists: Playlist | Playlist[]) {
    this.all = union(this.all, (<Playlist[]>[]).concat(playlists))
  },

  /**
   * Remove a playlist/playlists from the store.
   */
  remove (playlists: Playlist | Playlist[]) {
    this.all = difference(this.all, (<Playlist[]>[]).concat(playlists))
  },

  store (name: string, songs: Song[] = [], rules: SmartPlaylistRuleGroup[] = []): Promise<Playlist> {
    const songIds = songs.map(song => song.id)
    const serializedRules = this.serializeSmartPlaylistRulesForStorage(rules)

    NProgress.start()

    return new Promise((resolve, reject): void => http.post(
      'playlist',
      { name, songs: songIds, rules: serializedRules }, ({ data: playlist }: { data: Playlist }) => {
        playlist.songs = songs
        this.populateContent(playlist)
        this.add(playlist)
        alerts.success(`Created playlist &quot;${playlist.name}&quot;.`)

        if (playlist.is_smart) {
          this.setupSmartPlaylist(playlist)
        }

        resolve(playlist)
      }, (error: any) => reject(error))
    )
  },

  delete (playlist: Playlist): Promise<any> {
    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.delete(`playlist/${playlist.id}`, {}, ({ data } : { data: any }) => {
        this.remove(playlist)
        resolve(data)
      }, (error: any) => reject(error))
    })
  },

  async addSongs (playlist: Playlist, songs: Song[]): Promise<Playlist> {
    if (!playlist.populated) {
      await this.fetchSongs(playlist)
    }

    return new Promise((resolve, reject): void => {
      const count = playlist.songs.length
      playlist.songs = union(playlist.songs, songs)

      if (count === playlist.songs.length) {
        resolve(playlist)
        return
      }

      NProgress.start()

      http.put(`playlist/${playlist.id}/sync`, { songs: playlist.songs.map(song => song.id) }, (): void => {
        alerts.success(`Added ${pluralize(songs.length, 'song')} into &quot;${playlist.name}&quot;.`)

        // Playlist's songs are not reactive right away for some reason.
        // This is a dirty hack to force reactivity.
        playlist.name = `${playlist.name} `
        playlist.name = playlist.name.trim()

        resolve(playlist)
      }, (error: any) => reject(error))
    })
  },

  removeSongs: (playlist: Playlist, songs: Song[]): Promise<Playlist> => {
    return new Promise((resolve, reject) => {
      if (playlist.is_smart) {
        resolve(playlist)
        return
      }

      NProgress.start()

      playlist.songs = difference(playlist.songs, songs)
      http.put(`playlist/${playlist.id}/sync`, { songs: playlist.songs.map(song => song.id) }, (): void => {
        alerts.success(`Removed ${pluralize(songs.length, 'song')} from &quot;${playlist.name}&quot;.`)
        resolve(playlist)
      }, (error: any) => reject(error))
    })
  },

  update (playlist: Playlist): Promise<Playlist> {
    const serializedRules = this.serializeSmartPlaylistRulesForStorage(playlist.rules)

    NProgress.start()

    return new Promise((resolve, reject): void => http.put(
      `playlist/${playlist.id}`,
      { name: playlist.name, rules: serializedRules },
      (): void => {
        alerts.success(`Updated playlist &quot;${playlist.name}&quot;.`)
        resolve(playlist)
      },
      (error: any) => reject(error)
    ))
  },

  createEmptySmartPlaylistRule: (): SmartPlaylistRule => ({
    id: (new Date()).getTime(),
    model: models[0],
    operator: operators[0].operator,
    value: ['']
  }),

  createEmptySmartPlaylistRuleGroup: (): SmartPlaylistRuleGroup => ({
    id: (new Date()).getTime(),
    rules: []
  }),

  /**
   * Serialize the rule (groups) to be ready for database.
   */
  serializeSmartPlaylistRulesForStorage: (ruleGroups: SmartPlaylistRuleGroup[]): object[] | null => {
    if (!ruleGroups || !ruleGroups.length) {
      return null
    }

    const serializedGroups = JSON.parse(JSON.stringify(ruleGroups))

    serializedGroups.forEach((group: any): void => {
      group.rules.forEach((rule: any) => {
        rule.model = rule.model.name
      })
    })

    return serializedGroups
  }
}
