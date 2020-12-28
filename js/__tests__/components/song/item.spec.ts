import each from 'jest-each'
import Component from '@/components/song/item.vue'
import factory from '@/__tests__/factory'
import { playback } from '@/services'
import { queueStore } from '@/stores'
import { mock } from '@/__tests__/__helpers__'
import { Wrapper, shallow } from '@/__tests__/adapter'

describe('components/song/item', () => {
  let item, song: Song, artist: Artist, album: Album, wrapper: Wrapper

  beforeEach(() => {
    artist = factory<Artist>('artist')
    album = factory<Album>('album', {
      artist,
      artist_id: artist.id
    })

    song = factory<Song>('song', {
      artist,
      album,
      artist_id: artist.id,
      album_id: album.id,
      fmtLength: '04:56'
    })

    item = { song, selected: false }
    wrapper = shallow(Component, { propsData: { item } })
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    const html = wrapper.html()
    expect(html).toMatch(song.track.toString())
    expect(html).toMatch(song.title)
    expect(html).toMatch(artist.name)
    expect(html).toMatch(album.name)
    expect(html).toMatch('04:56')
  })

  each([[true, false], [false, true]]).test('queuing and playing behavior', (shouldQueue, queued) => {
    const containsStub = mock(queueStore, 'contains', queued)
    const queueStub = mock(queueStore, 'queueAfterCurrent')
    const playStub = mock(playback, 'play')
    wrapper.dblclick('tr')
    expect(containsStub).toHaveBeenCalledWith(song)
    if (queued) {
      expect(queueStub).not.toHaveBeenCalled()
    } else {
      expect(queueStub).toHaveBeenCalledWith(song)
    }
    expect(playStub).toHaveBeenCalledWith(song)
  })

  each([
    ['Stopped', 'play'],
    ['Playing', 'pause'],
    ['Paused', 'resume']
  ]).test('if state is currently "%s", %s', (state, action) => {
    const m = mock(playback, action)
    song.playbackState = state
    wrapper.click('.play')
    expect(m).toHaveBeenCalled()
  })
})
