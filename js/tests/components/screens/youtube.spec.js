import Component from '@/components/screens/youtube'

describe('components/screens/youtube', () => {
  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })
})
