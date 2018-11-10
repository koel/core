import Component from '@/components/screens/user-list.vue'
import UserCard from '@/components/user/card.vue'
import AddUserForm from '@/components/user/add-form.vue'
import EditUserForm from '@/components/user/edit-form.vue'
import factory from '@/tests/factory'
import { userStore } from '@/stores'

describe('components/screens/user-list', () => {
  it('displays the users', async done => {
    userStore.all = factory('user', 10)
    const wrapper = await mount(Component)
    Vue.nextTick(() => {
      wrapper.findAll(UserCard).should.have.lengthOf(10)
      done()
    })
  })

  it('adds new user', () => {
    userStore.all = factory('user', 10)
    const wrapper = mount(Component)
    const openStub = stub(wrapper.vm.$refs.addUserForm, 'open')
    wrapper.has(AddUserForm).should.be.true
    wrapper.click('.btn-add')
    openStub.called.should.be.true
    openStub.restore()
  })

  it('edits a user', () => {
    userStore.all = factory('user', 10)
    const wrapper = mount(Component)
    const editStub = stub(wrapper.vm.$refs.editUserForm, 'open')
    wrapper.has(EditUserForm).should.be.true
    wrapper.click('.btn-edit')
    editStub.calledWith(userStore.all[0]).should.be.true
    editStub.restore()
  })
})

