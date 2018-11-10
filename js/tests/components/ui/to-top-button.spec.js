import Component from '@/components/ui/to-top-button.vue'
import { $ } from '@/utils'
import { mock } from '@/tests/__helpers__'

describe('components/ui/to-top-button', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })

  it('scrolls to top', () => {
    const m = mock($, 'scrollTo')
    shallow(Component).click('button')
    expect(m).toHaveBeenCalled()
  })
})
