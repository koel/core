import YouTube from '@/components/ui/youtube-video-list.vue'
import { youtube as youtubeService } from '@/services'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'
import { mount } from '@/tests/adapter'

describe('components/ui/youtube', () => {
  let song: Song
  beforeEach(() => {
    song = factory('song')
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays a list of videos', async done => {
    const wrapper = mount(YouTube, {
      propsData: { song },
      data: () => ({
        videos: factory('video', 5)
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('a.video')).toHaveLength(5)
    done()
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
    expect(searchStub).toHaveBeenCalledWith(song, '')
  })
})
