import Component from '@/components/screens/queue.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/__tests__/factory'
import { queueStore, songStore } from '@/stores'
import { playback } from '@/services'
import { mock } from '@/__tests__/__helpers__'
import { mount, shallow } from '@/__tests__/adapter'

describe('components/screens/queue', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async () => {
    const wrapper = mount(Component, {
      data: () => ({
        state: {
          songs: factory<Song>('song', 10)
        }
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('h1.heading').text()).toMatch('Current Queue')
    expect(wrapper.has(SongList)).toBe(true)
  })

  it('prompts to shuffle all songs if there are songs and current queue is empty', () => {
    songStore.state.songs = factory<Song>('song', 10)
    expect(shallow(Component, {
      data: () => ({
        state: { songs: [] }
      })
    }).find('a.start').text()).toMatch('shuffling all songs')
  })

  it("doesn't prompt to shuffle all songs if there is no song", () => {
    songStore.state.songs = []
    expect(shallow(Component, {
      data: () => ({
        state: {
          songs: []
        }
      })
    }).has('a.start')).toBe(false)
  })

  it('shuffles all songs in the queue if any', () => {
    const m = mock(playback, 'queueAndPlay')
    const songs = factory<Song>('song', 10)
    const wrapper = mount(Component, {
      data: () => ({
        state: { songs }
      })
    })

    wrapper.click('button.btn-shuffle-all')
    expect(m).toHaveBeenCalledWith(songs, true)
  })

  it('shuffles all available songs if there are no songs queued', () => {
    const songs = factory<Song>('song', 10)
    songStore.state.songs = songs
    const m = mock(playback, 'queueAndPlay')
    const c = shallow(Component, {
      data: () => ({
        state: {
          songs: []
        }
      })
    })

    c.click('a.start')
    expect(m).toHaveBeenCalledWith(songs, true)
  })

  it('clears the queue', () => {
    const m = mock(queueStore, 'clear')
    mount(Component, {
      data: () => ({
        state: { songs: factory('song', 10) }
      })
    }).click('button.btn-clear-queue')
    expect(m).toHaveBeenCalled()
  })
})
