import Component from '@/components/layout/main-wrapper/sidebar.vue'
import { sharedStore } from '@/stores'
import factory from '@/__tests__/factory'
import { mount, shallow } from '@/__tests__/adapter'

describe('compoponents/layout/main-wrapper/sidebar', () => {
  it('renders properly', async () => {
    const wrapper = mount(Component)

    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })

  it('displays YouTube menu item if using YouTube', () => {
    sharedStore.state.useYouTube = true
    expect(shallow(Component)).toMatchSnapshot()
  })

  it('displays management menu items for admin', async () => {
    const wrapper = shallow(Component, {
      data: () => ({
        userState: {
          current: factory('user', { is_admin: true })
        }
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })

  it('displays new version info', async () => {
    sharedStore.state.currentVersion = 'v0.0.0'
    sharedStore.state.latestVersion = 'v0.0.1'
    const wrapper = shallow(Component, {
      data: () => ({
        userState: {
          current: factory('user', { is_admin: true })
        }
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })
})
