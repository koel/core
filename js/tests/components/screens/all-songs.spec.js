import Component from '@/components/screens/all-songs.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { songStore } from '@/stores'

describe.skip('components/screens/all-songs', () => {
  it('renders properly', async done => {
    songStore.all = factory('song', 10)
    const wrapper = await shallow(Component)

    Vue.nextTick(() => {
      wrapper.find('h1.heading').text().should.contain('All Songs')
      wrapper.has(SongList).should.be.true
      done()
    })
  })
})
