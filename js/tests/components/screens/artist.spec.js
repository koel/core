import Component from '@/components/screens/artist.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'
import { download, artistInfo as artistInfoService } from '@/services'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'

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

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders upon receiving event', async done => {
    const wrapper = await shallow(Component, {
      propsData: { artist }
    })

    Vue.nextTick(() => {
      const html = wrapper.html()
      expect(html).toMatch(artist.name)
      expect(html).toMatch('1 album')
      expect(wrapper.hasAll(SongList, SongListControls)).toBe(true)
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
    const m = mock(artistInfoService, 'fetch')
    wrapper.click('a.info')
    expect(m).toHaveBeenCalledWith(artist)
  })

  it('allows downloading', () => {
    const wrapper = shallow(Component, {
      propsData: { artist },
      data: () => ({
        sharedState: { allowDownload: true }
      })
    })
    const m = mock(download, 'fromArtist')
    wrapper.click('a.download')
    expect(m).toHaveBeenCalledWith(artist)
  })
})
