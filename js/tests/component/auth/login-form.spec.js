import Component from '@/components/auth/login-form.vue'
import { userStore } from '@/stores'

describe('components/auth/login-form', () => {
  it('displays a form for users to log in', () => {
    shallow(Component).findAll('form').should.have.lengthOf(1)
  })

  it('triggers login when form is submitted', () => {
    const wrapper = shallow(Component)
    const loginStub = stub(userStore, 'login')
    wrapper.submit('form')
    loginStub.calledWith(wrapper.vm.email, wrapper.vm.password).should.be.true
    loginStub.restore()
  })
})
