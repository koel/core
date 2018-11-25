import Component from '@/components/screens/user-list.vue'
import UserCard from '@/components/user/card.vue'
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

  it('adds new user', () => {
    const m = mock(event, 'emit')
    shallow(Component).click('.btn-add')
    expect(m).toHaveBeenCalledWith('MODAL_SHOW_ADD_USER_FORM')
  })

  it('edits a user', () => {
    userStore.all = factory('user', 10)
    const m = mock(event, 'emit')
    mount(Component).click('.btn-edit') // the first Edit button
    expect(m).toHaveBeenCalledWith('MODAL_SHOW_EDIT_USER_FORM', userStore.all[0])
  })
})

