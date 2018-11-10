import Component from '@/components/auth/login-form.vue'
import { userStore } from '@/stores'
import { mockAsNoop } from '@/tests/__helpers__'

describe('components/auth/login-form', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays a form for users to log in', () => {
    expect(shallow(Component).findAll('form').length).toBe(1)
  })

  it('triggers login when form is submitted', () => {
    const loginStub = mockAsNoop(userStore, 'login')
    shallow(Component, {
      data: () => ({
        email: 'john@doe.com',
        password: 'secret'
      })
    }).submit('form')
    expect(loginStub).toHaveBeenCalledWith('john@doe.com', 'secret')
  })
})
