import Component from '@/components/screens/user-list'
import UserCard from '@/components/user/card'
import factory from '@/tests/factory'
import { userStore } from '@/stores'
import { event } from '@/utils'
import { mock } from '@/tests/__helpers__'

describe('components/screens/user-list', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays the users', async done => {
    userStore.all = factory('user', 10)
    const wrapper = await mount(Component)

    wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll(UserCard)).toHaveLength(10)
      done()
    })
  })

  it('adds new user', async done => {
    const emitMock = mock(event, 'emit')
    const wrapper = await mount(Component)

    wrapper.vm.$nextTick(() => {
      wrapper.click('.btn-add')
      expect(emitMock).toHaveBeenCalledWith('MODAL_SHOW_ADD_USER_FORM')
      done()
    })
  })

  it('edits a user', () => {
    userStore.all = factory('user', 10)
    const emitMock = mock(event, 'emit')
    mount(Component).click('.btn-edit')

    expect(emitMock).toHaveBeenCalledWith('MODAL_SHOW_EDIT_USER_FORM', userStore.all[0])
  })
})
