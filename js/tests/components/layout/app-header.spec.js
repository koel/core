import Component from '@/components/layout/app-header.vue'
import { event } from '@/utils'
import { mock } from '@/tests/__helpers__'

describe('components/layout/app-header', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders propery', async done => {
    const wrapper = await mount(Component)
    Vue.nextTick(() => {
      expect(wrapper).toMatchSnapshot()
      done()
    })
  })

  it('toggles sidebar', () => {
    const m = mock(event, 'emit')
    shallow(Component).click('.hamburger')
    expect(m).toHaveBeenCalledWith('TOGGLE_SIDEBAR')
  })

  it('toggles search form', () => {
    const m = mock(event, 'emit')
    shallow(Component).click('.magnifier')
    expect(m).toHaveBeenCalledWith('TOGGLE_SEARCH_FORM')
  })
})
