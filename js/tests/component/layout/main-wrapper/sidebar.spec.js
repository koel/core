import Component from '@/components/layout/main-wrapper/sidebar.vue'
import Playlists from '@/components/playlist/list.vue'
import { sharedStore } from '@/stores'
import factory from '@/tests/factory'

describe('compoponents/layout/main-wrapper/sidebar', () => {
  it('renders properly', async done => {
    const wrapper = await mount(Component)

    Vue.nextTick(() => {
      wrapper.hasAll(
        Playlists,
        ...(['home', 'queue', 'songs', 'albums', 'artists'].map(item => `.menu a.${item}`))
      ).should.be.true
      done()
    })
  })

  it('displays YouTube menu item if using YouTube', () => {
    sharedStore.state.useYouTube = true
    shallow(Component).has('a.youtube').should.be.true
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
      wrapper.hasAll('.menu a.settings', '.menu a.users').should.be.true
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
      wrapper.has('a.new-ver').should.be.true
      wrapper.find('a.new-ver').text().should.contain('Koel version v0.0.1 is available!')
      done()
    })
  })
})
