import { http } from '.'
import { event } from '@/utils'
import router from '@/router'

interface YouTube {
  searchVideosRelatedToSong: (song: Song, nextPageToken: string) => Promise<YouTubeSearchResult>
  play: (video: Video) => void
}

interface YouTubeSearchResult {
  nextPageToken: string
  items: object[]
}

export const youtube: YouTube = {
  searchVideosRelatedToSong: (song: Song, nextPageToken: string): Promise<YouTubeSearchResult> => {
    return new Promise((resolve, reject): void => {
      http.get(`youtube/search/song/${song.id}?pageToken=${nextPageToken}`,
        ({ data: { nextPageToken, items }} : { data: YouTubeSearchResult }) => resolve({ nextPageToken, items }),
        (error: any) => reject(error)
      )
    })
  },

  play: (video: Video): void => {
    event.emit(event.$names.PLAY_YOUTUBE_VIDEO, {
      id: video.id.videoId,
      title: video.snippet.title
    })

    router.go('youtube')
  }
}
