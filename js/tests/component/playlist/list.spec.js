import Component from '@/components/playlist/list.vue'
import PlaylistItem from '@/components/playlist/item.vue'
import factory from '@/tests/factory'

describe('components/playlist/list', () => {
  it('renders properly', async done => {
    const wrapper = await mount(Component, {
      data: () => ({
        playlistState: {
          playlists: factory('playlist', 5)
        }
      })
    })

    Vue.nextTick(() => {
      wrapper.findAll(PlaylistItem).should.have.lengthOf(7) // favorites + recently played + 5 playlists
      done()
    })
  })
})
