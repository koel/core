import { playlistStore, favoriteStore } from '@/stores'
import { ls } from '.'
import { alerts } from '@/utils'

interface Download {
  fromSongs(songs: Song | Song[]): void
  fromAlbum(album: Album): void
  fromArtist(artist: Artist): void
  fromPlaylist(playlist: Playlist): void
  fromFavorites(): void
  trigger(uri: string): void
}

let events: any

if (KOEL_ENV === 'app') {
  events = require('&/events').default
}

export const download: Download = {
  fromSongs (songs: Song | Song[]): void {
    const query = (<Song[]>[]).concat(songs).reduce((q, song) => `songs[]=${song.id}&${q}`, '')
    this.trigger(`songs?${query}`)
  },

  fromAlbum (album: Album): void {
    this.trigger(`album/${album.id}`)
  },

  fromArtist (artist: Artist): void {
    this.trigger(`artist/${artist.id}`)
  },

  fromPlaylist (playlist: Playlist): void {
    if (playlistStore.getSongs(playlist).length) {
      this.trigger(`playlist/${playlist.id}`)
    }
  },

  fromFavorites (): void {
    if (favoriteStore.all.length) {
      this.trigger('favorites')
    }
  },

  /**
   * Build a download link using a segment and trigger it.
   *
   * @param  {string} uri The uri segment, corresponding to the song(s),
   *                      artist, playlist, or album.
   */
  trigger: (uri: string) => {
    const sep = uri.includes('?') ? '&' : '?'
    const url = `${window.BASE_URL}api/download/${uri}${sep}jwt-token=${ls.get('jwt-token')}`

    if (KOEL_ENV === 'app') {
      require('electron').ipcRenderer.send(events.DOWNLOAD, url)
      alerts.success('Download started!')
    } else {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.setAttribute('src', url)
      document.body.appendChild(iframe)
    }
  }
}
