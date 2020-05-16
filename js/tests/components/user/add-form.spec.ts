import Component from '@/components/user/add-form.vue'
import factory from '@/tests/factory'
import { userStore } from '@/stores'
import { mock } from '@/tests/__helpers__'
import { shallow, mount } from '@/tests/adapter'

describe('components/user/add-form', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('opens', () => {
    const wrapper = shallow(Component)
    expect(wrapper).toMatchSnapshot()
  })

  it('adds a new user', () => {
    const newUser = factory<User>('user')
    const storeStub = mock(userStore, 'store')
    const wrapper = shallow(Component)
    wrapper.setData({ newUser })
    wrapper.submit('form.user-add')
    expect(storeStub).toHaveBeenCalledWith(newUser.name, newUser.email, newUser.password)
  })

  it('cancels', async () => {
    const wrapper = mount(Component)

    await wrapper.vm.$nextTick()
    wrapper.click('.btn-cancel')
    expect(wrapper.hasEmitted('close')).toBe(true)
  })
})
