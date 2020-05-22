import { http, albumInfo, artistInfo } from '..'
import { YouTubePlayer } from 'youtube-player/dist/types'

export const songInfo = {
  fetch: (song: Song): Promise<Song> => {
    return new Promise((resolve, reject): void => {
      if (song.infoRetrieved) {
        resolve(song)
        return
      }

      http.get(`${song.id}/info`, (
        {
          data: {
            artist_info,
            album_info,
            youtube,
            lyrics
          }
        }: {
          data: {
            artist_info: ArtistInfo,
            album_info: AlbumInfo,
            youtube: {
              items: YouTubeVideo[],
              nextPageToken: string
            },
            lyrics: string
          }
        }
      ): void => {
        song.lyrics = lyrics
        artist_info && artistInfo.merge(song.artist, artist_info)
        album_info && albumInfo.merge(song.album, album_info)
        song.youtube = youtube
        song.infoRetrieved = true
        resolve(song)
      }, (error: any) => reject(error))
    })
  }
}
