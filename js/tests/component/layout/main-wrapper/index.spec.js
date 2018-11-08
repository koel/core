import Component from '@/components/layout/main-wrapper/index.vue'
import Sidebar from '@/components/layout/main-wrapper/sidebar.vue'
import MainContent from '@/components/layout/main-wrapper/main-content.vue'
import Extra from '@/components/layout/main-wrapper/extra-panel.vue'

describe('component/layout/main-wrapper/index', () => {
  it('renders properly', async done => {
    const wrapper = await mount(Component)
    Vue.nextTick(() => {
      wrapper.hasAll(Sidebar, MainContent, Extra).should.be.true
      done()
    })
  })
})
