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
    expect(wrapper.find('li.available')).toBeDefined()
    expect(wrapper.html()).toMatch('Foo and bar')
  })

  it('has an iTunes link if there is no such local song', () => {
    const m = mock(songStore, 'guess', false)
    expect(shallow(Component, { propsData: {
      track,
      album,
      index: 1
    }}).html()).toMatch('http://koel.local/api/itunes/song/42?q=Foo%20and%20bar&amp;jwt-token=abcdef')
    expect(m).toHaveBeenCalledWith('Foo and bar', album)
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
