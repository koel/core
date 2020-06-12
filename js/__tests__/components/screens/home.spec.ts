import Home from '@/components/screens/home.vue'
import AlbumItem from '@/components/album/card.vue'
import ArtistItem from '@/components/artist/card.vue'
import HomeSongItem from '@/components/song/home-item.vue'
import factory from '@/__tests__/factory'
import { eventBus } from '@/utils'
import { mock } from '@/__tests__/__helpers__'
import { mount } from '@/__tests__/adapter'

describe('components/screens/home', () => {
  let data: object

  beforeEach(() => {
    const artists = factory<Artist>('artist', 5, {
      songs: factory<Song>('song', 3),
      albums: factory<Album>('album', 2)
    })

    data = {
      recentSongs: factory<Song>('song', 7),
      top: {
        artists,
        songs: factory<Song>('song', 4),
        albums: factory<Album>('album', 6)
      },
      recentlyAdded: {
        albums: factory<Album>('album', 3),
        songs: factory<Song>('song', 10)
      }
    }
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays all sections', async () => {
    const wrapper = mount(Home, { data: () => data })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('h1.heading span').text()).toMatch(/.+/)
    expect(wrapper.find('.top-song-list').findAll(HomeSongItem)).toHaveLength(4)
    expect(wrapper.find('.recent-song-list').findAll(HomeSongItem)).toHaveLength(7)

    const recentlyAddedSection = wrapper.find('.recently-added')
    expect(recentlyAddedSection.findAll(AlbumItem)).toHaveLength(3)
    expect(recentlyAddedSection.findAll(HomeSongItem)).toHaveLength(10)

    expect(wrapper.find('.top-artists').findAll(ArtistItem)).toHaveLength(5)
    expect(wrapper.find('.top-albums').findAll(AlbumItem)).toHaveLength(6)
  })

  it('refreshes when a new song is played', async () => {
    const wrapper = mount(Home)

    await wrapper.vm.$nextTick()
    const m = mock(wrapper.vm, 'refreshDashboard')
    eventBus.emit('SONG_STARTED', factory('song'))
    expect(m).toHaveBeenCalled()
  })
})
