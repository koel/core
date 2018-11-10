import Component from '@/components/user/edit-form.vue'
import { userStore } from '@/stores'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'

describe('components/user/edit-form', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('opens', () => {
    const user = factory('user')
    const wrapper = shallow(Component)
    wrapper.vm.open(user)
    expect(wrapper.has('form.user-edit')).toBe(true)
    expect(wrapper.find('input[name=name]').value).toBe(user.name)
    expect(wrapper.find('input[name=email]').value).toBe(user.email)
  })

  it('saves', () => {
    const user = factory('user')
    const updateStub = mock(userStore, 'update')
    const wrapper = shallow(Component)
    wrapper.vm.open(user)
    wrapper.submit('form')
    expect(updateStub).toHaveBeenCalledWith(user, user.name, user.email, user.password)
  })

  it('cancels', () => {
    const user = factory('user')
    const updateStub = mock(userStore, 'update')
    const wrapper = shallow(Component)
    wrapper.vm.open(user)
    expect(wrapper.has('form.user-edit')).toBe(true)
    wrapper.click('.btn-cancel')
    expect(wrapper.has('form.user-edit')).toBe(false)
    expect(updateStub).not.toHaveBeenCalled()
  })
})
