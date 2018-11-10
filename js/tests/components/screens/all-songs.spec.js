import Component from '@/components/screens/all-songs.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { songStore } from '@/stores'

describe('components/screens/all-songs', () => {
  it('renders properly', async done => {
    songStore.all = factory('song', 10)
    const wrapper = await shallow(Component)

    Vue.nextTick(() => {
      expect(wrapper.find('h1.heading').text()).toMatch('All Songs')
      expect(wrapper.has(SongList)).toBe(true)
      done()
    })
  })
})
