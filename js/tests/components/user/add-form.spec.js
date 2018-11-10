import Component from '@/components/user/add-form.vue'
import factory from '@/tests/factory'
import { userStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

describe('components/user/add-form', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('opens', () => {
    const wrapper = shallow(Component)
    wrapper.vm.open()
    expect(wrapper).toMatchSnapshot()
  })

  it('adds a new user', () => {
    const newUser = factory('user')
    const storeStub = mock(userStore, 'store')
    const wrapper = shallow(Component)
    wrapper.vm.open()
    wrapper.setData({ newUser })
    wrapper.submit('form.user-add')
    expect(storeStub).toHaveBeenCalledWith(newUser.name, newUser.email, newUser.password)
  })

  it('cancels', () => {
    const wrapper = shallow(Component)
    wrapper.vm.open()
    expect(wrapper.has('form.user-add')).toBe(true)
    wrapper.vm.cancel()
    expect(wrapper.has('form.user-add')).toBe(false)
  })
})
