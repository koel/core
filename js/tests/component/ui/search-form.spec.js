import Component from '@/components/ui/search-form.vue'
import { event } from '@/utils'

describe('components/ui/search-form', () => {
  it('renders properly', () => {
    shallow(Component).has('[type=search]').should.be.true
  })

  it('emits an event to filter', async done => {
    const emitStub = stub(event, 'emit')
    const wrapper = shallow(Component)
    wrapper.find('[type=search]').setValue('foo').input()

    setTimeout(() => {
      emitStub.calledWith('FILTER_CHANGED', 'foo').should.be.true
      emitStub.restore()
      done()
    }, 200) // because of debounce
  })
})
