import Component from '@/components/album/info'
import AlbumThumbnail from '@/components/ui/album-artist-thumbnail'
import factory from '@/tests/factory'

describe('components/album/info', () => {
  it('displays the info as a sidebar by default', () => {
    const wrapper = shallow(Component, {
      propsData: {
        album: factory('album')
      }
    })
    expect(wrapper.findAll('.album-info.sidebar')).toHaveLength(1)
    expect(wrapper.findAll('.album-info.full')).toHaveLength(0)
  })

  it('can display the info in full mode', () => {
    const wrapper = shallow(Component, {
      propsData: {
        album: factory('album'),
        mode: 'full'
      }
    })
    expect(wrapper.findAll('.album-info.sidebar')).toHaveLength(0)
    expect(wrapper.findAll('.album-info.full')).toHaveLength(1)
  })

  it('triggers showing full wiki', () => {
    const album = factory('album')
    const wrapper = shallow(Component, {
      propsData: { album }
    })
    wrapper.click('.wiki button.more')
    expect(wrapper.html()).toMatch(album.info.wiki.full)
  })

  it('shows the album thumbnail', async done => {
    const album = factory('album')
    const wrapper = await mount(Component, {
      propsData: { album }
    })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.has(AlbumThumbnail)).toBe(true)
      done()
    })
  })
})
