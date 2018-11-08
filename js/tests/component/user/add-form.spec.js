import Component from '@/components/user/add-form.vue'
import factory from '@/tests/factory'
import { userStore } from '@/stores'

describe('components/user/add-form', () => {
  it('opens', () => {
    const wrapper = shallow(Component)
    wrapper.vm.open()
    wrapper.has('form.user-add').should.be.true
  })

  it('adds a new user', () => {
    const newUser = factory('user')
    const storeStub = stub(userStore, 'store')
    const wrapper = shallow(Component)
    wrapper.vm.open()
    wrapper.setData({ newUser })
    wrapper.submit('form.user-add')
    storeStub.calledWith(newUser.name, newUser.email, newUser.password).should.be.true
    storeStub.restore()
  })

  it('cancels', () => {
    const wrapper = shallow(Component)
    wrapper.vm.open()
    wrapper.has('form.user-add').should.be.true
    wrapper.vm.cancel()
    wrapper.has('form.user-add').should.be.false
  })
})
