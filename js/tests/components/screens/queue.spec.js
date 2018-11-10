import Component from '@/components/screens/queue.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { queueStore, songStore } from '@/stores'
import { playback } from '@/services'
import { mock } from '@/tests/__helpers__'

describe('components/screens/queue', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async done => {
    const wrapper = await shallow(Component, {
      data: () => ({
        state: { songs: factory('song', 10) }
      })
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('h1.heading').text()).toMatch('Current Queue')
      expect(wrapper.has(SongList)).toBe(true)
      done()
    })
  })

  it('prompts to shuffle all songs if there are songs and current queue is empty', () => {
    songStore.state.songs = factory('song', 10)
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
    const songs = factory('song', 10)
    const wrapper = mount(Component, {
      data: () => ({
        state: { songs }
      })
    })

    wrapper.click('button.btn-shuffle-all')
    expect(m).toHaveBeenCalledWith(songs, true)
  })

  it('shuffles all available songs if there are no songs queued', () => {
    const m = mock(playback, 'queueAndPlay')
    mount(Component, {
      data: () => ({
        state: {
          songs: []
        }
      })
    }).click('button.btn-shuffle-all')
    expect(m).toHaveBeenCalledWith(songStore.all, true)
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
