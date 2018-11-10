import Home from '@/components/screens/home.vue'
import AlbumItem from '@/components/album/card.vue'
import ArtistItem from '@/components/artist/card.vue'
import HomeSongItem from '@/components/song/home-item.vue'
import factory from '@/tests/factory'
import { event } from '@/utils'
import { mock } from '@/tests/__helpers__'

describe('components/screens/home', () => {
  let data

  beforeEach(() => {
    const artists = factory('artist', 5, {
      songs: factory('song', 3),
      albums: factory('album', 2)
    })

    data = {
      recentSongs: factory('song', 7),
      top: {
        artists,
        songs: factory('song', 4),
        albums: factory('album', 6)
      },
      recentlyAdded: {
        albums: factory('album', 3),
        songs: factory('song', 10)
      }
    }
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays all sections', async done => {
    const wrapper = await mount(Home, { data: () => data })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('h1.heading span').text()).toMatch(/.+/)
      expect(wrapper.find('.top-song-list').findAll(HomeSongItem)).toHaveLength(4)
      expect(wrapper.find('.recent-song-list').findAll(HomeSongItem)).toHaveLength(7)

      const recentlyAddedSection = wrapper.find('.recently-added')
      expect(recentlyAddedSection.findAll(AlbumItem)).toHaveLength(3)
      expect(recentlyAddedSection.findAll(HomeSongItem)).toHaveLength(10)

      expect(wrapper.find('.top-artists').findAll(ArtistItem)).toHaveLength(5)
      expect(wrapper.find('.top-albums').findAll(AlbumItem)).toHaveLength(6)
      done()
    })
  })

  it('refreshes when a new song is played', async done => {
    const wrapper = await mount(Home)

    wrapper.vm.$nextTick(() => {
      const m = mock(wrapper.vm, 'refreshDashboard')
      event.emit('SONG_PLAYED', factory('song'))
      expect(m).toHaveBeenCalled()
      done()
    })
  })
})
