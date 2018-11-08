import Component from '@/components/ui/view-mode-switch.vue'

describe('components/ui/view-mode-switch', () => {
  it('changes the view mode', () => {
    const wrapper = shallow(Component, { propsData: {
      mode: 'list',
      for: 'albums'
    }})
    wrapper.click('a.thumbnails').hasEmitted('viewModeChanged', 'thumbnails').should.be.true
    wrapper.click('a.list').hasEmitted('viewModeChanged', 'list').should.be.true
  })
})
