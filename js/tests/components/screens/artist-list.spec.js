import List from '@/components/screens/artist-list'
import Card from '@/components/artist/card'
import factory from '@/tests/factory'

describe('components/screens/artist-list', () => {
  it('displays a list of artists', async done => {
    const wrapper = await mount(List, {
      sync: false, // https://github.com/vuejs/vue-test-utils/issues/673
      data: () => ({
        artists: factory('artist', 5, {
          albums: [],
          songs: []
        })
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll(Card)).toHaveLength(5)
    done()
  })
})
