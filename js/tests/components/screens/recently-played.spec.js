import Component from '@/components/screens/recently-played.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { recentlyPlayedStore } from '@/stores'
import { event } from '@/utils'
import { mock } from '@/tests/__helpers__'

describe('components/screens/recently-played', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async done => {
    const wrapper = await mount(Component, {
      data: () => ({
        state: {
          songs: factory('song', 5)
        }
      })
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('h1.heading').text()).toMatch('Recently Played')
      expect(wrapper.has(SongList)).toBe(true)
      done()
    })
  })

  it('fetch and populate content on demand', () => {
    shallow(Component)
    const m = mock(recentlyPlayedStore, 'fetchAll')
    event.emit('LOAD_MAIN_CONTENT', 'recently-played')
    expect(m).toHaveBeenCalled()
  })
})
