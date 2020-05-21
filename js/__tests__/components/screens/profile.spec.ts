import each from 'jest-each'
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

  it('renders properly', () => {
    expect(shallow(Profile)).toMatchSnapshot()
  })

  each([
    ['foo', 'foo'],
    ['foo', 'bar'],
    ['', '']
  ]).test('correctly handles passwords "%s" and "%s"', (pwd, confirmPwd) => {
    const wrapper = shallow(Profile, {
      data: () => ({ pwd, confirmPwd })
    })
    const m = mock(userStore, 'updateProfile')
    wrapper.submit('form')
    if (pwd === confirmPwd) {
      expect(m).toHaveBeenCalled()
    } else {
      expect(m).not.toHaveBeenCalled()
    }
  })

  each([
    ['notify'],
    ['confirmClosing'],
    ['transcodeOnMobile']
  ]).test('updates preference "%s"', key => {
    const m = mock(preferences, 'save')
    shallow(Profile).change(`input[name=${key}]`)
    expect(m).toHaveBeenCalled()
  })
})
