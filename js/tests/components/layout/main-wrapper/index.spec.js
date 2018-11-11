import Component from '@/components/layout/main-wrapper/index.vue'

describe('component/layout/main-wrapper/index', () => {
  it('renders properly', async done => {
    const wrapper = await shallow(Component)
    wrapper.vm.$nextTick(() => {
      expect(wrapper).toMatchSnapshot()
      done()
    })
  })
})
