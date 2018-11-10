import YouTube from '@/components/ui/youtube-video-list.vue'
import { youtube as youtubeService } from '@/services'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'

describe('components/ui/youtube', () => {
  let song
  beforeEach(() => {
    song = factory('song')
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays a list of videos', async (done) => {
    const wrapper = await mount(YouTube, {
      propsData: { song },
      data: () => ({
        videos: factory('video', 5)
      })
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll('a.video')).toHaveLength(5)
      done()
    })
  })

  it('loads more videos on demand', () => {
    const wrapper = mount(YouTube, {
      propsData: { song },
      data: () => ({
        videos: factory('video', 5)
      })
    })
    const searchStub = mock(youtubeService, 'searchVideosRelatedToSong')
    wrapper.click('button.more')
    expect(searchStub).toHaveBeenCalledWith(song)
  })
})
