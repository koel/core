import Component from '@/components/screens/user-list.vue'
import UserCard from '@/components/user/card.vue'
import factory from '@/tests/factory'
import { userStore } from '@/stores'
import { event } from '@/utils'
import { mock } from '@/tests/__helpers__'
import { mount } from '@/tests/adapter'

describe('components/screens/user-list', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays the users', async () => {
    userStore.all = factory<User>('user', 10)
    const wrapper = mount(Component)

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll(UserCard)).toHaveLength(10)
  })

  it('adds new user', async () => {
    const emitMock = mock(event, 'emit')
    const wrapper = mount(Component)

    await wrapper.vm.$nextTick()
    wrapper.click('.btn-add')
    expect(emitMock).toHaveBeenCalledWith('MODAL_SHOW_ADD_USER_FORM')
  })

  it('edits a user', () => {
    userStore.all = factory<User>('user', 10)
    const emitMock = mock(event, 'emit')
    mount(Component).click('.btn-edit')

    expect(emitMock).toHaveBeenCalledWith('MODAL_SHOW_EDIT_USER_FORM', userStore.all[0])
  })
})
