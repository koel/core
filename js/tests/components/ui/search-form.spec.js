import Component from '@/components/ui/search-form.vue'
import { event } from '@/utils'
import { mock } from '@/tests/__helpers__'

describe('components/ui/search-form', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })

  it('emits an event to filter', async done => {
    const emitStub = mock(event, 'emit')
    const wrapper = shallow(Component)
    wrapper.find('[type=search]').setValue('foo').input()

    setTimeout(() => {
      expect(emitStub).toHaveBeenCalledWith('FILTER_CHANGED', 'foo')
      done()
    }, 200) // because of debounce
  })
})
