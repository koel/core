import { youtube } from '@/services'
import { event } from '@/utils'
import router from '@/router'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'

describe('services/youtube', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('plays a video', () => {
    const video = factory('video', {
      id: {
        videoId: 'foo'
      },
      snippet: {
        title: 'Bar'
      }
    })
    const emitMock = mock(event, 'emit')
    const goMock = mock(router, 'go')

    youtube.play(video)
    expect(emitMock).toHaveBeenCalledWith('PLAY_YOUTUBE_VIDEO', { id: 'foo', title: 'Bar' })
    expect(goMock).toHaveBeenCalledWith('youtube')
  })
})
