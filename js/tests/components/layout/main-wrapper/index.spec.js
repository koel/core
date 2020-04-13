import Component from '@/components/layout/main-wrapper/index'

// Mock manually this component because it changes randomly and breaks the snapshot
jest.mock('@/components/layout/main-wrapper/main-content', () => {
  return {
    render: (h) => h("div")
  }
})

describe('component/layout/main-wrapper/index', () => {
  it('renders properly', async done => {
    const wrapper = await shallow(Component)
    wrapper.vm.$nextTick(() => {
      expect(wrapper).toMatchSnapshot()
      done()
    })
  })
})
