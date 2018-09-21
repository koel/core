import { playlistStore, favoriteStore } from '@/stores'
import { ls } from '.'
import { alerts } from '@/utils'

let events
if (KOEL_ENV === 'app') {
  events = require('&/events').default
}

export const download = {
  /**
   * @param {Array.<Object>|Object} songs
   */
  fromSongs (songs) {
    const query = [].concat(songs).reduce((q, song) => `songs[]=${song.id}&${q}`, '')
    return this.trigger(`songs?${query}`)
  },

  fromAlbum (album) {
    return this.trigger(`album/${album.id}`)
  },

  fromArtist (artist) {
    // It's safe to assume an artist always has songs.
    // After all, what's an artist without her songs?
    // (See what I did there? Yes, I'm advocating for women's rights).
    return this.trigger(`artist/${artist.id}`)
  },

  fromPlaylist (playlist) {
    return playlistStore.getSongs(playlist).length ? this.trigger(`playlist/${playlist.id}`) : null
  },

  fromFavorites () {
    return favoriteStore.all.length ? this.trigger('favorites') : null
  },

  /**
   * Build a download link using a segment and trigger it.
   *
   * @param  {string} uri The uri segment, corresponding to the song(s),
   *            artist, playlist, or album.
   */
  trigger: uri => {
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
