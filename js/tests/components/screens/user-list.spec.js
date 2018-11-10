import Component from '@/components/screens/user-list.vue'
import UserCard from '@/components/user/card.vue'
import AddUserForm from '@/components/user/add-form.vue'
import EditUserForm from '@/components/user/edit-form.vue'
import factory from '@/tests/factory'
import { userStore } from '@/stores'
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
    userStore.all = factory('user', 10)
    const wrapper = mount(Component)
    const m = mock(wrapper.vm.$refs.addUserForm, 'open')
    expect(wrapper.has(AddUserForm)).toBe(true)
    wrapper.click('.btn-add')
    expect(m).toHaveBeenCalled()
  })

  it('edits a user', () => {
    userStore.all = factory('user', 10)
    const wrapper = mount(Component)
    const m = mock(wrapper.vm.$refs.editUserForm, 'open')
    expect(wrapper.has(EditUserForm)).toBe(true)
    wrapper.click('.btn-edit')
    expect(m).toHaveBeenCalledWith(userStore.all[0])
  })
})

