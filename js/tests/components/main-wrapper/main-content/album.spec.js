import Component from '@/components/main-wrapper/main-content/album.vue'
import SongList from '@/components/shared/song-list.vue'
import SongListControls from '@/components/shared/song-list-controls.vue'
import { download, albumInfo as albumInfoService } from '@/services'
import factory from '@/tests/factory'

describe('components/main-wrapper/main-content/album', () => {
  it('renders properly', () => {
    const album = factory('album')
    const wrapper = shallow(Component, {
      propsData: { album }
    })
    const html = wrapper.html()
    html.should.contain(album.name)
    html.should.contain(album.artist.name)
    wrapper.hasAll(SongList, SongListControls).should.be.true
  })

  it('loads info from Last.fm', () => {
    const album = factory('album', { info: null })
    const wrapper = shallow(Component, {
      propsData: { album },
      data: () => ({
        sharedState: { useLastfm: true }
      })
    })
    const stub = sinon.stub(albumInfoService, 'fetch')
    wrapper.click('a.info')
    stub.calledWith(album).should.be.true
    stub.restore()
  })

  it('allows downloading', () => {
    const album = factory('album')
    const wrapper = shallow(Component, {
      propsData: { album },
      data: () => ({
        sharedState: { allowDownload: true }
      })
    })
    const downloadStub = sinon.stub(download, 'fromAlbum')
    wrapper.click('a.download')
    downloadStub.calledWith(album).should.be.true
    downloadStub.restore()
  })
})
