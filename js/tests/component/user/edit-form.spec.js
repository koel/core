import Component from '@/components/user/edit-form.vue'
import { userStore } from '@/stores'
import factory from '@/tests/factory'

describe('components/user/edit-form', () => {
  it('opens', () => {
    const user = factory('user')
    const wrapper = shallow(Component)
    wrapper.vm.open(user)
    wrapper.has('form.user-edit').should.be.true
    wrapper.find('input[name=name]').value.should.equal(user.name)
    wrapper.find('input[name=email]').value.should.equal(user.email)
  })

  it('saves', () => {
    const user = factory('user')
    const updateStub = stub(userStore, 'update')
    const wrapper = shallow(Component)
    wrapper.vm.open(user)
    wrapper.submit('form')
    updateStub.calledWith(user, user.name, user.email, user.password).should.be.true
    updateStub.restore()
  })

  it('cancels', () => {
    const user = factory('user')
    const updateStub = stub(userStore, 'update')
    const wrapper = shallow(Component)
    wrapper.vm.open(user)
    wrapper.has('form.user-edit').should.be.true
    wrapper.click('.btn-cancel')
    wrapper.has('form.user-edit').should.be.false
    updateStub.called.should.be.false
    updateStub.restore()
  })
})
