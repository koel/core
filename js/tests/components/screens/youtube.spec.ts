import Component from '@/components/screens/youtube.vue'
import { shallow } from '@/tests/adapter'

describe('components/screens/youtube', () => {
  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })
})
