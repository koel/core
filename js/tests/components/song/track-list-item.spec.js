import Component from '@/components/song/track-list-item.vue'
import { sharedStore, songStore, queueStore } from '@/stores'
import { playback, ls } from '@/services'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'

describe('componnents/song/track-list-item', () => {
  let song
  const track = {
    title: 'Foo and bar',
    fmtLenth: '00:42'
  }
  const album = factory('album', { id: 42 })
  window.BASE_URL = 'http://koel.local/'

  beforeEach(() => {
    sharedStore.state.useiTunes = true
    song = factory('song')
    mock(ls, 'get', 'abcdef')
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders', () => {
    const wrapper = shallow(Component, { propsData: {
      track,
      album,
      index: 1
    }})
    expect(wrapper).toMatchSnapshot()
  })

  it('plays', () => {
    mock(songStore, 'guess', song)
    const containsStub = mock(queueStore, 'contains', false)
    const queueStub = mock(queueStore, 'queueAfterCurrent')
    const playStub = mock(playback, 'play')

    shallow(Component, { propsData: {
      track,
      album,
      index: 1
    }}).click('li')

    expect(containsStub).toHaveBeenCalledWith(song)
    expect(queueStub).toHaveBeenCalledWith(song)
    expect(playStub).toHaveBeenCalledWith(song)
  })
})
