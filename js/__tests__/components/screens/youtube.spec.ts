import Component from '@/components/screens/youtube.vue'
import { shallow } from '@/__tests__/adapter'

describe('components/screens/youtube', () => {
  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })
})
