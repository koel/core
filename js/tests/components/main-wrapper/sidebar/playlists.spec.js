import Component from '@/components/main-wrapper/sidebar/playlists.vue'
import PlaylistItem from '@/components/main-wrapper/sidebar/playlist-item.vue'
import factory from '@/tests/factory'

describe('compopents/main-wrapper/main-content/sidebar/playlists', () => {
  it('renders properly', async (done) => {
    const wrapper = await mount(Component, {
      data: () => ({
        playlistState: {
          playlists: factory('playlist', 5)
        }
      })
    })

    wrapper.vm.$nextTick(() => {
      wrapper.findAll(PlaylistItem).should.have.lengthOf(6) // favorites + 5 playlists
      done()
    })
  })
})
