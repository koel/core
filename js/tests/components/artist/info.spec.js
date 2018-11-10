import Component from '@/components/artist/info.vue'
import factory from '@/tests/factory'

describe('components/artist/info', () => {
  it('displays the info as a sidebar by default', () => {
    const wrapper = shallow(Component, {
      propsData: {
        artist: factory('artist')
      }
    })
    expect(wrapper.findAll('.artist-info.sidebar')).toHaveLength(1)
    expect(wrapper.findAll('.artist-info.full')).toHaveLength(0)
  })

  it('can display the info in full mode', () => {
    const wrapper = shallow(Component, {
      propsData: {
        artist: factory('artist'),
        mode: 'full'
      }
    })
    expect(wrapper.findAll('.artist-info.sidebar')).toHaveLength(0)
    expect(wrapper.findAll('.artist-info.full')).toHaveLength(1)
  })

  it('triggers showing full bio', () => {
    const artist = factory('artist')
    const wrapper = shallow(Component, {
      propsData: { artist }
    })
    wrapper.click('.bio button.more')
    expect(wrapper.html()).toMatch(artist.info.bio.full)
  })

  it('displays a message if the artist has no info', () => {
    const wrapper = mount(Component, {
      propsData: {
        artist: factory('artist', { info: null })
      }
    })
    expect(wrapper.html()).toMatch('Nothing can be found. This artist is a mystery.')
  })
})
