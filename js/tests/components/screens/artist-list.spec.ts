import List from '@/components/screens/artist-list.vue'
import Card from '@/components/artist/card.vue'
import factory from '@/tests/factory'
import { mount } from '@/tests/adapter'

describe('components/screens/artist-list', () => {
  it('displays a list of artists', async done => {
    const wrapper = mount(List, {
      sync: false, // https://github.com/vuejs/vue-test-utils/issues/673
      data: () => ({
        artists: factory<Artist>('artist', 5, {
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
