import Profile from '@/components/screens/profile.vue'
import factory from '@/__tests__/factory'
import { userStore, preferenceStore as preferences } from '@/stores'
import { mock } from '@/__tests__/__helpers__'
import { shallow } from '@/__tests__/adapter'

describe('components/screens/profile', () => {
  beforeEach(() => {
    userStore.state.current = factory('user')
    preferences.init()
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it.each([
    ['foo', 'foo'],
    ['foo', 'bar'],
    ['', '']
  ])('correctly handles passwords "%s" and "%s"', (password, confirmPassword) => {
    const wrapper = shallow(Profile, {
      data: () => ({ password, confirmPassword })
    })

    const m = mock(userStore, 'updateProfile')
    wrapper.submit('form')

    if (password === confirmPassword) {
      expect(m).toHaveBeenCalled()
    } else {
      expect(m).not.toHaveBeenCalled()
    }
  })

  it.each([
    ['notify'],
    ['confirm_closing'],
    ['transcode_on_mobile']
  ])('updates preference "%s"', key => {
    const m = mock(preferences, 'save')
    shallow(Profile).change(`input[name=${key}]`)
    expect(m).toHaveBeenCalled()
  })
})
