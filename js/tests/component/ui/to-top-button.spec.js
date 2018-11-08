import Component from '@/components/ui/to-top-button.vue'
import { $ } from '@/utils'

describe('components/ui/to-top-button', () => {
  it('scrolls to top', () => {
    const scrollToStub = stub($, 'scrollTo')
    shallow(Component).click('button')
    scrollToStub.called.should.be.true
    scrollToStub.restore()
  })
})
