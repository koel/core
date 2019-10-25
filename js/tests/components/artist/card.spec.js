import Component from '@/components/artist/card'
import Thumbnail from '@/components/ui/album-artist-thumbnail'
import factory from '@/tests/factory'
import { playback, download } from '@/services'
import { sharedStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

describe('components/artist/card', () => {
  let artist

  beforeEach(() => {
    sharedStore.state = { allowDownload: true }
    artist = factory('artist', {
      id: 3, // make sure it's not "Various Artists"
      albums: factory('album', 4),
      songs: factory('song', 16)
    })
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async done => {
    const wrapper = await mount(Component, { propsData: { artist }})

    wrapper.vm.$nextTick(() => {
      expect(wrapper.has(Thumbnail)).toBe(true)
      const html = wrapper.html()
      expect(html).toMatch('4 albums')
      expect(html).toMatch('16 songs')
      expect(html).toMatch(artist.name)

      done()
    })
  })

  it('shuffles', () => {
    const wrapper = shallow(Component, { propsData: { artist }})
    const playStub = mock(playback, 'playAllByArtist')

    wrapper.click('.shuffle-artist')
    expect(playStub).toHaveBeenCalledWith(artist, true)
  })

  it('downloads', () => {
    const wrapper = shallow(Component, { propsData: { artist }})
    const downloadStub = mock(download, 'fromArtist')

    wrapper.click('.download-artist')
    expect(downloadStub).toHaveBeenCalledWith(artist)
  })
})
