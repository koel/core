import each from 'jest-each'
import Component from '@/components/meta/about-dialog.vue'
import factory from '@/tests/factory'
import { shallow } from '@/tests/adapter'

describe('components/meta/about-dialog', () => {
  const versionPermutations = [
    ['v4.0.0'/* latest ver */, 'v4.0.0-beta'/* this ver */, true/* admin */, true/* show new ver notification */],
    ['v4.0.0', 'v4.0.0', true, false],
    ['v4.0.0', 'v3.9.0', false, false]
  ]

  each(versionPermutations).test('new version notification', (latestVersion, currentVersion, isAdmin, visible) => {
    const wrapper = shallow(Component, {
      data: () => ({
        userState: {
          current: factory('user', {
            is_admin: isAdmin
          })
        },
        sharedState: {
          latestVersion,
          currentVersion
        }
      })
    })
    expect(wrapper.has('.new-version')).toBe(visible)
  })

  const demoPermutations = [
    [true, true],
    [false, false]
  ]

  each(demoPermutations).test('builds demo version with(out) credits', (inDemoEnv, creditVisible) => {
    const wrapper = shallow(Component, {
      data: () => ({
        userState: {
          current: factory('user', {
            is_admin: true
          })
        },
        sharedState: {
          latestVersion: 'v1.0.0',
          currentVersion: 'v1.0.0'
        },
        demo: inDemoEnv
      })
    })
    expect(wrapper.has('.demo-credits')).toBe(creditVisible)
  })
})
