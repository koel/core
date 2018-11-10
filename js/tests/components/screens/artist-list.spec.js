import List from '@/components/screens/artist-list.vue'
import Card from '@/components/artist/card.vue'
import factory from '@/tests/factory'

describe.skip('components/screens/artist-list', () => {
  it('displays a list of artists', async done => {
    const artists = factory('artist', 5)
    artists.forEach(artist => {
      artist.albums = []
      artist.songs = []
    })

    const wrapper = await mount(List, {
      data: () => ({ artists })
    })

    Vue.nextTick(() => {
      wrapper.findAll(Card).should.have.lengthOf(5)
      done()
    })
  })
})
