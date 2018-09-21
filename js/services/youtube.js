import { http } from '.'
import { event } from '@/utils'
import router from '@/router'

export const youtube = {
  searchVideosRelatedToSong (song) {
    song.youtube = song.youtube || {}
    const pageToken = song.youtube.nextPageToken || ''

    return new Promise((resolve, reject) => {
      http.get(`youtube/search/song/${song.id}?pageToken=${pageToken}`,
        ({ data: { nextPageToken, items }}) => {
          song.youtube.nextPageToken = nextPageToken
          song.youtube.items.push(...items)
          resolve()
        }, error => reject(error)
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
