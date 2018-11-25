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
    const user = factory('user', {
      name: 'Bob Dylan',
      email: 'knocking@heaven.door'
    })
    const wrapper = shallow(Component, {
      propsData: {
        user
      }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('saves', () => {
    const user = factory('user')
    const updateStub = mock(userStore, 'update')
    const wrapper = shallow(Component, {
      propsData: {
        user
      }
    })
    wrapper.submit('form')
    expect(updateStub).toHaveBeenCalledWith(user, user.name, user.email, user.password)
  })

  it('cancels', () => {
    const user = factory('user')
    const updateStub = mock(userStore, 'update')
    const wrapper = shallow(Component, {
      propsData: {
        user
      }
    })
    wrapper.click('.btn-cancel')
    expect(wrapper.hasEmitted('close')).toBe(true)
    expect(updateStub).not.toHaveBeenCalled()
  })
})
