import Component from '@/components/screens/youtube.vue'

describe('components/screens/youtube', () => {
  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })
})
