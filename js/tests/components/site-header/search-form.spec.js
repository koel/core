import Component from '@/components/site-header/search-form.vue'
import { event } from '@/utils'

describe('components/site-header/search-form.vue', () => {
  it('emits the filter event', () => {
    const emitStub = sinon.stub(event, 'emit')
    shallow(Component).find('input[type=search]').setValue('foo').input()
    setTimeout(() => {
      emitStub.calledWith('FILTER_CHANGED', 'foo').should.be.true
    }, 200)
  })
})
