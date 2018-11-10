import Component from '@/components/artist/card.vue'
import factory from '@/tests/factory'
import { playback, download } from '@/services'
import { queueStore, sharedStore } from '@/stores'
import { mockAsNoop } from '@/tests/__helpers__'

describe('components/artist/card', () => {
  let artist
  let wrapper

  beforeEach(() => {
    sharedStore.state = { allowDownload: true }
    artist = factory('artist', {
      id: 3, // make sure it's not "Various Artists"
      albums: factory('album', 4),
      songs: factory('song', 16)
    })
    wrapper = shallow(Component, { propsData: { artist }})
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    expect(wrapper.has('span.cover')).toBe(true)
    const html = wrapper.html()
    expect(html).toMatch('4 albums')
    expect(html).toMatch('16 songs')
    expect(html).toMatch(artist.name)
  })

  it('plays if clicked', () => {
    const playStub = mockAsNoop(playback, 'playAllByArtist')
    wrapper.click('.control-play')
    expect(playStub).toHaveBeenCalledWith(artist, false)
  })

  it('queues if ctrl/meta clicked', () => {
    const queueStub = mockAsNoop(queueStore, 'queue')
    wrapper.click('.control-play', { metaKey: true })
    expect(queueStub).toHaveBeenCalled()
    wrapper.click('.control-play', { ctrlKey: true })
    expect(queueStub).toHaveBeenCalled()
  })

  it('shuffles', () => {
    const playStub = mockAsNoop(playback, 'playAllByArtist')
    wrapper.click('.shuffle-artist')
    expect(playStub).toHaveBeenCalledWith(artist, true)
  })

  it('downloads', () => {
    const downloadStub = mockAsNoop(download, 'fromArtist')
    wrapper.click('.download-artist')
    expect(downloadStub).toHaveBeenCalledWith(artist)
  })
})
