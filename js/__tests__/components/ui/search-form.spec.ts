import Component from '@/components/ui/search-form.vue'
import { mock } from '@/__tests__/__helpers__'
import { shallow } from '@/__tests__/adapter'
import { eventBus } from '@/utils'

describe('components/ui/search-form', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })

  it('emits an event to filter', async done => {
    const emitStub = mock(eventBus, 'emit')
    const wrapper = shallow(Component)
    wrapper.find('[type=search]').setValue('foo').input()

    setTimeout(() => {
      expect(emitStub).toHaveBeenCalledWith('FILTER_CHANGED', 'foo')
      done()
    }, 300) // because of debounce
  })
})
