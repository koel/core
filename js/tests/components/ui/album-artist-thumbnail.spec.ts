import each from 'jest-each'
import Component from '@/components/ui/album-artist-thumbnail.vue'
import factory from '@/tests/factory'
import { playback } from '@/services'
import { queueStore, sharedStore } from '@/stores'
import { mock } from '@/tests/__helpers__'
import { Wrapper, shallow } from '@/tests/adapter'

describe('components/ui/album-artist-thumbnail(album)', () => {
  let album: Album
  let wrapper: Wrapper

  beforeEach(() => {
    album = factory<Album>('album', {
      songs: factory<Song>('song', 10)
    })
    // @ts-ignore
    sharedStore.state = { allowDownload: true }
    wrapper = shallow(Component, { propsData: { entity: album } })
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
  let artist: Artist
  let wrapper: Wrapper

  beforeEach(() => {
    // @ts-ignore
    sharedStore.state = { allowDownload: true }
    artist = factory<Artist>('artist', {
      id: 3, // make sure it's not "Various Artists"
      albums: factory<Album>('album', 4),
      songs: factory<Song>('song', 16)
    })
    wrapper = shallow(Component, { propsData: { entity: artist } })
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
