import Component from '@/components/layout/app-header.vue'
import SearchForm from '@/components/ui/search-form.vue'
import UserBadge from '@/components/user/badge.vue'
import { event } from '@/utils'

describe('components/layout/app-header', () => {
  it('renders propery', async done => {
    const wrapper = await mount(Component)
    Vue.nextTick(() => {
      wrapper.hasAll(SearchForm, UserBadge).should.be.true
      done()
    })
  })

  it('toggles sidebar', () => {
    const emitStub = stub(event, 'emit')
    shallow(Component).click('.hamburger')
    emitStub.calledWith('TOGGLE_SIDEBAR').should.be.true
    emitStub.restore()
  })

  it('toggles search form', () => {
    const emitStub = stub(event, 'emit')
    shallow(Component).click('.magnifier')
    emitStub.calledWith('TOGGLE_SEARCH_FORM').should.be.true
    emitStub.restore()
  })
})
