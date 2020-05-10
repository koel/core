import Component from '@/components/screens/favorites'
import SongList from '@/components/song/list'
import SongListControls from '@/components/song/list-controls'
import { download } from '@/services'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'

describe('components/screens/favorites', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays the song list if there are favorites', async done => {
    const wrapper = await mount(Component, {
      data: () => ({
        state: {
          songs: factory('song', 5)
        }
      })
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.hasAll(SongList, SongListControls)).toBe(true)
      expect(wrapper.findAll('div.none')).toHaveLength(0)
      done()
    })
  })

  it('displays a fallback message if there are no favorites', () => {
    const wrapper = shallow(Component, {
      data: () => ({
        state: {
          songs: []
        }
      })
    })

    expect(wrapper.findAll('div.none')).toHaveLength(1)
  })

  it('allows downloading', () => {
    const m = mock(download, 'fromFavorites')

    shallow(Component, {
      data: () => ({
        state: {
          songs: factory('song', 5)
        },
        sharedState: { allowDownload: true }
      })
    }).click('a.download')

    expect(m).toHaveBeenCalled()
  })
})
