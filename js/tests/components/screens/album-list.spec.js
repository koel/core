import List from '@/components/screens/album-list'
import Card from '@/components/album/card'
import factory from '@/tests/factory'

describe('components/screens/album-list', () => {
  it('displays a list of albums', async done => {
    const wrapper = await mount(List, {
      sync: false, // https://github.com/vuejs/vue-test-utils/issues/673
      data: () => ({
        albums: factory('album', 5)
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll(Card)).toHaveLength(5)
    done()
  })
})
