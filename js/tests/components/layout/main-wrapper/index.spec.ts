import Component from '@/components/layout/main-wrapper/index.vue'
import { shallow } from '@/tests/adapter'

describe('component/layout/main-wrapper/index', () => {
  it('renders properly', async () => {
    const wrapper = shallow(Component)
    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })
})
