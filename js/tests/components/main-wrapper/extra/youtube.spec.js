import YouTube from '@/components/main-wrapper/extra/youtube.vue'
import { youtube as youtubeService } from '@/services'
import factory from '@/tests/factory'

describe('components/main-wrapper/extra/youtube', () => {
  let song
  beforeEach(() => {
    song = factory('song')
  })

  it('displays a list of videos', async (done) => {
    const wrapper = await mount(YouTube, {
      propsData: { song },
      data: () => ({
        videos: factory('video', 5)
      })
    })

    wrapper.vm.$nextTick(() => {
      wrapper.findAll('a.video').should.have.lengthOf(5)
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
    const stub = sinon.stub(youtubeService, 'searchVideosRelatedToSong')
    wrapper.click('button.more')
    stub.calledWith(song).should.be.true
    stub.restore()
  })
})
