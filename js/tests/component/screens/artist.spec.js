import Component from '@/components/screens/artist.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'
import { download, artistInfo as artistInfoService } from '@/services'
import factory from '@/tests/factory'

describe('components/screens/artist', () => {
  let artist
  beforeEach(() => {
    artist = factory('artist')
    const album = factory('album', {
      artist,
      artist_id: artist.id
    })
    artist.albums = [album]
    artist.songs = factory('song', 5, {
      artist,
      album,
      artist_id: artist.id,
      album_id: album.id
    })
  })

  it('renders upon receiving event', async done => {
    const wrapper = await shallow(Component, {
      propsData: { artist }
    })

    Vue.nextTick(() => {
      const html = wrapper.html()
      html.should.contain(artist.name)
      html.should.contain('1 album')
      wrapper.hasAll(SongList, SongListControls).should.be.true
      done()
    })
  })

  it('loads info from Last.fm', () => {
    artist.info = null
    const wrapper = shallow(Component, {
      propsData: { artist },
      data: () => ({
        sharedState: { useLastfm: true }
      })
    })
    const fetchStub = stub(artistInfoService, 'fetch')
    wrapper.click('a.info')
    fetchStub.calledWith(artist).should.be.true
    fetchStub.restore()
  })

  it('allows downloading', () => {
    const wrapper = shallow(Component, {
      propsData: { artist },
      data: () => ({
        sharedState: { allowDownload: true }
      })
    })
    const downloadStub = stub(download, 'fromArtist')
    wrapper.click('a.download')
    downloadStub.calledWith(artist).should.be.true
    downloadStub.restore()
  })
})
