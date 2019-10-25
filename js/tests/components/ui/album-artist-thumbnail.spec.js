import each from 'jest-each'
import Component from '@/components/ui/album-artist-thumbnail'
import factory from '@/tests/factory'
import { playback } from '@/services'
import { queueStore, sharedStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

describe('components/ui/album-artist-thumbnail(album)', () => {
  let album
  let wrapper

  beforeEach(() => {
    album = factory('album', {
      songs: factory('song', 10)
    })
    sharedStore.state = { allowDownload: true }
    wrapper = shallow(Component, { propsData: { entity: album }})
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('plays if clicked', () => {
    const m = mock(playback, 'playAllInAlbum')
    wrapper.click('.control-play')
    expect(m).toHaveBeenCalledWith(album, false)
  })

  each([['metaKey'], ['ctrlKey']]).test('queues if %s is clicked', key => {
    const m = mock(queueStore, 'queue')
    wrapper.click('.control-play', { [key]: true })
    expect(m).toHaveBeenCalled()
  })
})

describe('components/ui/album-artist-thumbnail(artist)', () => {
  let artist
  let wrapper

  beforeEach(() => {
    sharedStore.state = { allowDownload: true }
    artist = factory('artist', {
      id: 3, // make sure it's not "Various Artists"
      albums: factory('album', 4),
      songs: factory('song', 16)
    })
    wrapper = shallow(Component, { propsData: { entity: artist }})
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('plays if clicked', () => {
    const m = mock(playback, 'playAllByArtist')
    wrapper.click('.control-play')
    expect(m).toHaveBeenCalledWith(artist, false)
  })

  each([['metaKey'], ['ctrlKey']]).test('queues if %s is clicked', key => {
    const m = mock(queueStore, 'queue')
    wrapper.click('.control-play', { [key]: true })
    expect(m).toHaveBeenCalled()
  })
})
