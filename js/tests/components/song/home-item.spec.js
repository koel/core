import each from 'jest-each'
import Component from '@/components/song/home-item.vue'
import factory from '@/tests/factory'
import { queueStore } from '@/stores'
import { playback } from '@/services'
import { mock } from '@/tests/__helpers__'

describe('components/song/home-item', () => {
  let propsData, song, wrapper

  beforeEach(() => {
    song = factory('song', {
      artist: factory('artist', {
        id: 42,
        name: 'Foo Fighter'
      }),
      playCount: 10,
      playbackState: 'stopped',
      title: 'Foo bar'
    })

    propsData = {
      song,
      topPlayCount: 42
    }

    wrapper = shallow(Component, { propsData })
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  each([[true, false], [false, true]]).test('queuing and playing behavior', (shouldQueue, queued) => {
    const containsStub = mock(queueStore, 'contains', queued)
    const queueStub = mock(queueStore, 'queueAfterCurrent')
    const playStub = mock(playback, 'play')
    wrapper.dblclick('.song-item-home')
    expect(containsStub).toHaveBeenCalledWith(song)
    if (queued) {
      expect(queueStub).not.toHaveBeenCalled()
    } else {
      expect(queueStub).toHaveBeenCalledWith(song)
    }
    expect(playStub).toHaveBeenCalledWith(song)
  })

  each([
    ['stopped', 'play'],
    ['playing', 'pause'],
    ['paused', 'resume']
  ]).test('if state is currently "%s", %s', (state, action) => {
    const m = mock(playback, action)
    song.playbackState = state
    wrapper.click('.cover .control')
    expect(m).toHaveBeenCalled()
  })
})
