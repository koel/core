import { http } from '@/services'
import { eventBus } from '@/utils'
import { events } from '@/config'
import router from '@/router'

interface YouTube {
  searchVideosRelatedToSong: (song: Song, nextPageToken: string) => Promise<YouTubeSearchResult>
  play: (video: YouTubeVideo) => void
}

interface YouTubeSearchResult {
  nextPageToken: string
  items: object[]
}

export const youtube: YouTube = {
  searchVideosRelatedToSong: async (song: Song, nextPageToken: string): Promise<YouTubeSearchResult> => {
    return await http.get<YouTubeSearchResult>(`youtube/search/song/${song.id}?pageToken=${nextPageToken}`)
  },

  play: (video: YouTubeVideo): void => {
    eventBus.emit(events.PLAY_YOUTUBE_VIDEO, {
      id: video.id.videoId,
      title: video.snippet.title
    })

    router.go('youtube')
  }
}
