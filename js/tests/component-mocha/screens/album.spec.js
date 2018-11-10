import Component from '@/components/screens/album.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'
import { download, albumInfo as albumInfoService } from '@/services'
import factory from '@/tests/factory'

describe('components/screens/album', () => {
  it('renders properly', async done => {
    const album = factory('album')
    const wrapper = await shallow(Component, {
      propsData: { album }
    })

    Vue.nextTick(() => {
      const html = wrapper.html()
      html.should.contain(album.name)
      html.should.contain(album.artist.name)
      wrapper.hasAll(SongList, SongListControls).should.be.true
      done()
    })
  })

  it('loads info from Last.fm', () => {
    const album = factory('album', { info: null })
    const wrapper = shallow(Component, {
      propsData: { album },
      data: () => ({
        sharedState: { useLastfm: true }
      })
    })
    const fetchStub = stub(albumInfoService, 'fetch')
    wrapper.click('a.info')
    fetchStub.calledWith(album).should.be.true
    fetchStub.restore()
  })

  it('allows downloading', () => {
    const album = factory('album')
    const wrapper = shallow(Component, {
      propsData: { album },
      data: () => ({
        sharedState: { allowDownload: true }
      })
    })
    const downloadStub = stub(download, 'fromAlbum')
    wrapper.click('a.download')
    downloadStub.calledWith(album).should.be.true
    downloadStub.restore()
  })
})
