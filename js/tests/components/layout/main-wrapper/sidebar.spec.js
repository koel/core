import Component from '@/components/layout/main-wrapper/sidebar.vue'
import { sharedStore } from '@/stores'
import factory from '@/tests/factory'

describe('compoponents/layout/main-wrapper/sidebar', () => {
  it('renders properly', async done => {
    const wrapper = await mount(Component)

    Vue.nextTick(() => {
      expect(wrapper).toMatchSnapshot()
      done()
    })
  })

  it('displays YouTube menu item if using YouTube', () => {
    sharedStore.state.useYouTube = true
    expect(shallow(Component)).toMatchSnapshot()
  })

  it('displays management menu items for admin', async done => {
    const wrapper = await shallow(Component, {
      data: () => ({
        userState: {
          current: factory('user', { is_admin: true })
        }
      })
    })

    Vue.nextTick(() => {
      expect(wrapper).toMatchSnapshot()
      done()
    })
  })

  it('displays new version info', async done => {
    sharedStore.state.currentVersion = 'v0.0.0'
    sharedStore.state.latestVersion = 'v0.0.1'
    const wrapper = await shallow(Component, {
      data: () => ({
        userState: {
          current: factory('user', { is_admin: true })
        }
      })
    })

    Vue.nextTick(() => {
      expect(wrapper).toMatchSnapshot()
      done()
    })
  })
})
