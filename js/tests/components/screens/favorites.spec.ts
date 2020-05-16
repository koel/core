import Component from '@/components/screens/favorites.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'
import { download } from '@/services'
import factory from '@/tests/factory'
import { mock } from '@/tests/__helpers__'
import { mount, shallow } from '@/tests/adapter'

describe('components/screens/favorites', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('displays the song list if there are favorites', async () => {
    const wrapper = mount(Component, {
      data: () => ({
        state: {
          songs: factory('song', 5)
        }
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.hasAll(SongList, SongListControls)).toBe(true)
    expect(wrapper.findAll('div.none')).toHaveLength(0)
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
