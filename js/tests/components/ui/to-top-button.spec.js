import Component from '@/components/ui/to-top-button.vue'
import { $ } from '@/utils'
import { mockAsNoop } from '@/tests/__helpers__'

describe('components/ui/to-top-button', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('scrolls to top', () => {
    const scrollToStub = mockAsNoop($, 'scrollTo')
    shallow(Component).click('button')
    expect(scrollToStub).toHaveBeenCalled()
  })
})
