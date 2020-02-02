import { http } from '.'
import { event } from '@/utils'
import router from '@/router'

export const youtube = {
  searchVideosRelatedToSong: (song, nextPageToken) => {
    return new Promise((resolve, reject) => {
      http.get(`youtube/search/song/${song.id}?pageToken=${nextPageToken}`,
        ({ data: { nextPageToken, items }}) => resolve({ nextPageToken, items }),
        error => reject(error)
      )
    })
  },

  play: video => {
    event.emit(event.$names.PLAY_YOUTUBE_VIDEO, {
      id: video.id.videoId,
      title: video.snippet.title
    })
    router.go('youtube')
  }
}
