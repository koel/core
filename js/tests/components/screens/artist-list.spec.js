import List from '@/components/screens/artist-list.vue'
import Card from '@/components/artist/card.vue'
import factory from '@/tests/factory'

describe('components/screens/artist-list', () => {
  it('displays a list of artists', async done => {
    const wrapper = await mount(List, {
      data: () => ({
        artists: factory('artist', 5, {
          albums: [],
          songs: []
        })
      })
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll(Card)).toHaveLength(5)
      done()
    })
  })
})
