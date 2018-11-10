import Component from '@/components/screens/album.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'
import { download, albumInfo as albumInfoService } from '@/services'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'

describe('components/screens/album', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async done => {
    const album = factory('album')
    const wrapper = await shallow(Component, {
      propsData: { album }
    })

    Vue.nextTick(() => {
      const html = wrapper.html()
      expect(html).toMatch(album.name)
      expect(html).toMatch(album.artist.name)
      expect(wrapper.hasAll(SongList, SongListControls)).toBe(true)
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
    const m = mock(albumInfoService, 'fetch')
    wrapper.click('a.info')
    expect(m).toHaveBeenCalledWith(album)
  })

  it('allows downloading', () => {
    const album = factory('album')
    const wrapper = shallow(Component, {
      propsData: { album },
      data: () => ({
        sharedState: { allowDownload: true }
      })
    })
    const m = mock(download, 'fromAlbum')
    wrapper.click('a.download')
    expect(m).toHaveBeenCalledWith(album)
  })
})
