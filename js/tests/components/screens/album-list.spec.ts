import List from '@/components/screens/album-list.vue'
import factory from '@/tests/factory'
import { mount } from '@/tests/adapter'

describe('components/screens/album-list', () => {
  it('displays a list of albums', async () => {
    const wrapper = mount(List, {
      sync: false, // https://github.com/vuejs/vue-test-utils/issues/673,
      stubs: ['album-card'],
      data: () => ({
        albums: factory('album', 5)
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('album-card-stub')).toHaveLength(5)
  })
})
