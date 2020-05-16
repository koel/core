import { secondsToHis } from '@/utils'
import { http } from '..'

export const albumInfo = {
  fetch (album: Album): Promise<Album> {
    return new Promise((resolve, reject): void => {
      if (album.info) {
        resolve(album)
        return
      }

      http.get(`album/${album.id}/info`, ({ data }: { data: AlbumInfo | null }): void => {
        data && this.merge(album, data)
        resolve(album)
      }, (error: any) => reject(error))
    })
  },

  /**
   * Merge the (fetched) info into an album.
   */
  merge: (album: Album, info: AlbumInfo): void => {
    // Convert the duration into i:s
    info.tracks && info.tracks.forEach(track => (track.fmtLength = secondsToHis(track.length)))

    // If the album cover is not in a nice form, discard.
    if (typeof info.image !== 'string') {
      info.image = null
    }

    // Set the album cover on the client side to the retrieved image from server.
    if (info.image) {
      album.cover = info.image
    }

    album.info = info
  }
}
