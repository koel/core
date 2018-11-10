import each from 'jest-each'
import Component from '@/components/artist/card.vue'
import factory from '@/tests/factory'
import { playback, download } from '@/services'
import { queueStore, sharedStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

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
    const playStub = mock(playback, 'playAllByArtist')
    wrapper.click('.control-play')
    expect(playStub).toHaveBeenCalledWith(artist, false)
  })

  each([['metaKey'], ['ctrlKey']]).test('queues if %s is clicked', key => {
    const m = mock(queueStore, 'queue')
    wrapper.click('.control-play', { [key]: true })
    expect(m).toHaveBeenCalled()
  })

  it('shuffles', () => {
    const playStub = mock(playback, 'playAllByArtist')
    wrapper.click('.shuffle-artist')
    expect(playStub).toHaveBeenCalledWith(artist, true)
  })

  it('downloads', () => {
    const downloadStub = mock(download, 'fromArtist')
    wrapper.click('.download-artist')
    expect(downloadStub).toHaveBeenCalledWith(artist)
  })
})
