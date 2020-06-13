import Component from '@/components/user/edit-form.vue'
import { userStore } from '@/stores'
import factory from '@/__tests__/factory'
import { mock } from '@/__tests__/__helpers__'
import { shallow, mount } from '@/__tests__/adapter'

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
    const user = factory<User>('user', { is_admin: true })
    const updateMock = mock(userStore, 'update')
    const wrapper = shallow(Component, {
      propsData: {
        user
      }
    })
    wrapper.submit('form')
    expect(updateMock).toHaveBeenCalledWith(user, user.name, user.email, user.password, true)
  })

  it('cancels', async () => {
    const user = factory('user')
    const updateMock = mock(userStore, 'update')
    const wrapper = mount(Component, {
      propsData: {
        user
      }
    })

    await wrapper.vm.$nextTick()
    wrapper.click('.btn-cancel')
    expect(wrapper.hasEmitted('close')).toBe(true)
    expect(updateMock).not.toHaveBeenCalled()
  })
})
