import Component from '@/components/ui/view-mode-switch.vue'

describe('components/ui/view-mode-switch', () => {
  it('renders properly', () => {
    expect(shallow(Component, {
      propsData: {
        for: 'albums'
      }
    })).toMatchSnapshot()
  })

  it('changes the view mode', () => {
    const wrapper = shallow(Component, { propsData: {
      mode: 'list',
      for: 'albums'
    }})
    expect(wrapper.click('a.thumbnails').hasEmitted('viewModeChanged', 'thumbnails')).toBe(true)
    expect(wrapper.click('a.list').hasEmitted('viewModeChanged', 'list')).toBe(true)
  })
})
