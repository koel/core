import { http } from '..'

export const artistInfo = {
  fetch (artist: Artist): Promise<Artist> {
    return new Promise((resolve, reject): void => {
      if (artist.info) {
        resolve(artist)
        return
      }

      http.get(`artist/${artist.id}/info`, ({ data }: { data: ArtistInfo }): void => {
        data && this.merge(artist, data)
        resolve(artist)
      }, (error: any) => reject(error))
    })
  },

  /**
   * Merge the (fetched) info into an artist.
   */
  merge: (artist: Artist, info: ArtistInfo): void => {
    // If the artist image is not in a nice form, discard.
    if (typeof info.image !== 'string') {
      info.image = null
    }

    // Set the artist image on the client side to the retrieved image from server.
    if (info.image) {
      artist.image = info.image
    }

    artist.info = info
  }
}
