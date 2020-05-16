import Component from '@/components/user/card.vue'
import { userStore } from '@/stores'
import { alerts } from '@/utils'
import factory from '@/tests/factory'
import router from '@/router'
import { mock } from '@/tests/__helpers__'
import { shallow, mount } from '@/tests/adapter'

describe('components/user/card', () => {
  let user: User

  beforeEach(() => {
    user = factory<User>('user', {
      avatar: 'http://foo.bar/baz.jpg'
    })
    // make sure the user is not current logged in user
    userStore.current.id = user.id + 1
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    const wrapper = shallow(Component, { propsData: { user } })
    const html = wrapper.html()
    expect(html).toMatch(user.email)
    expect(html).toMatch(user.avatar)
    expect(html).toMatch(user.name)
    expect(wrapper.find('.btn-edit').text()).toBe('Edit')
    expect(wrapper.has('.btn-delete')).toBe(true)
  })

  it('has different behaviors if current user', () => {
    userStore.current.id = user.id
    const wrapper = shallow(Component, { propsData: { user } })
    expect(wrapper.has('.btn-delete')).toBe(false)
    expect(wrapper.find('.btn-edit').text()).toBe('Update Profile')
  })

  it('redirects to update profile if attempting to edit current user', async () => {
    const goStub = mock(router, 'go')
    userStore.current.id = user.id
    const wrapper = mount(Component, { propsData: { user } })

    await wrapper.vm.$nextTick()
    wrapper.click('.btn-edit')
    expect(goStub).toHaveBeenCalledWith('profile')
  })

  it('edits user', async () => {
    const wrapper = mount(Component, { propsData: { user } })

    await wrapper.vm.$nextTick()
    expect(wrapper.click('.btn-edit').hasEmitted('editUser', user)).toBe(true)
  })

  it('triggers deleting user', async () => {
    const confirmStub = mock(alerts, 'confirm')
    const wrapper = mount(Component, { propsData: { user } })

    await wrapper.vm.$nextTick()
    wrapper.click('.btn-delete')
    expect(confirmStub).toHaveBeenCalledWith(
      `You’re about to unperson ${user.name}. Are you sure?`,
      // @ts-ignore
      wrapper.vm.destroy
    )
  })

  it('deletes user', () => {
    const destroyStub = mock(userStore, 'destroy')
    // @ts-ignore
    shallow(Component, { propsData: { user } }).vm.destroy()
    expect(destroyStub).toHaveBeenCalledWith(user)
  })
})
