import Component from '@/components/screens/recently-played.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { recentlyPlayedStore } from '@/stores'
import { event } from '@/utils'

describe.skip('components/screens/recently-played', () => {
  it('renders properly', async done => {
    const wrapper = await mount(Component, {
      data: () => ({
        state: {
          songs: factory('song', 5)
        }
      })
    })

    Vue.nextTick(() => {
      wrapper.find('h1.heading').text().should.contain('Recently Played')
      wrapper.has(SongList).should.be.true
      done()
    })
  })

  it('fetch and populate content on demand', () => {
    shallow(Component)
    const fetchAllStub = stub(recentlyPlayedStore, 'fetchAll')
    event.emit('LOAD_MAIN_CONTENT', 'recently-played')
    fetchAllStub.called.should.be.true
    fetchAllStub.restore()
  })
})
