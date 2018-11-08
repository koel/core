import List from '@/components/screens/album-list.vue'
import Card from '@/components/album/card.vue'
import factory from '@/tests/factory'

describe('components/screens/album-list', () => {
  it('displays a list of albums', async done => {
    const wrapper = await mount(List, {
      data: () => ({
        albums: factory('album', 5)
      })
    })

    Vue.nextTick(() => {
      wrapper.findAll(Card).should.have.lengthOf(5)
      done()
    })
  })
})
