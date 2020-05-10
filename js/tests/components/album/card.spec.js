import Component from '@/components/album/card'
import Thumbnail from '@/components/ui/album-artist-thumbnail'
import factory from '@/tests/factory'
import { playback, download } from '@/services'
import { sharedStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

describe('components/album/card', () => {
  let album

  beforeEach(() => {
    album = factory('album', {
      songs: factory('song', 10)
    })
    sharedStore.state = { allowDownload: true }
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async done => {
    const wrapper = await mount(Component, { propsData: { album } })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.has(Thumbnail)).toBe(true)
      const html = wrapper.html()
      expect(html).toMatch(album.name)
      expect(html).toMatch('10 songs')

      done()
    })
  })

  it('shuffles', () => {
    const wrapper = shallow(Component, { propsData: { album } })
    const m = mock(playback, 'playAllInAlbum')

    wrapper.click('.shuffle-album')
    expect(m).toHaveBeenCalledWith(album, true)
  })

  it('downloads', () => {
    const wrapper = shallow(Component, { propsData: { album } })
    const m = mock(download, 'fromAlbum')

    wrapper.click('.download-album')
    expect(m).toHaveBeenCalledWith(album)
  })
})
