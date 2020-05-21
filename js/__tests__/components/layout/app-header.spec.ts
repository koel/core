import Component from '@/components/layout/app-header.vue'
import { eventBus } from '@/utils'
import { mock } from '@/__tests__/__helpers__'
import { mount, shallow } from '@/__tests__/adapter'

describe('components/layout/app-header', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders propery', async () => {
    const wrapper = mount(Component)
    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })

  it('toggles sidebar', () => {
    const m = mock(eventBus, 'emit')
    shallow(Component).click('.hamburger')
    expect(m).toHaveBeenCalledWith('TOGGLE_SIDEBAR')
  })

  it('toggles search form', () => {
    const m = mock(eventBus, 'emit')
    shallow(Component).click('.magnifier')
    expect(m).toHaveBeenCalledWith('TOGGLE_SEARCH_FORM')
  })
})
