import Component from '@/components/screens/youtube.vue'

describe.skip('components/screens/youtube', () => {
  it('renders properly', () => {
    shallow(Component).find('h1.heading').text().should.contain('YouTube Video')
  })
})
