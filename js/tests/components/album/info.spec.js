import AlbumInfo from '@/components/album/info.vue'
import TrackListItem from '@/components/song/track-list-item.vue'
import factory from '@/tests/factory'

describe('components/album/info', () => {
  it('displays the info as a sidebar by default', () => {
    const wrapper = shallow(AlbumInfo, {
      propsData: {
        album: factory('album')
      }
    })
    expect(wrapper.findAll('.album-info.sidebar')).toHaveLength(1)
    expect(wrapper.findAll('.album-info.full')).toHaveLength(0)
  })

  it('can display the info in full mode', () => {
    const wrapper = shallow(AlbumInfo, {
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
    const wrapper = shallow(AlbumInfo, {
      propsData: { album }
    })
    wrapper.click('.wiki button.more')
    expect(wrapper.html()).toMatch(album.info.wiki.full)
  })

  it('lists the correct number of tracks', async done => {
    const wrapper = await mount(AlbumInfo, {
      propsData: {
        album: factory('album')
      }
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll(TrackListItem)).toHaveLength(2)
      done()
    })
  })

  it('displays a message if the album has no info', () => {
    const wrapper = mount(AlbumInfo, {
      propsData: {
        album: factory('album', { info: null })
      }
    })
    expect(wrapper.html()).toMatch('No album information found.')
  })
})
