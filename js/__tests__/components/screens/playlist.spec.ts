import Component from '@/components/screens/playlist.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/__tests__/factory'
import { eventBus } from '@/utils'
import { playlistStore } from '@/stores'
import { mock } from '@/__tests__/__helpers__'
import { mount, shallow } from '@/__tests__/adapter'

describe('components/screens/playlist', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async () => {
    const playlist = factory<Playlist>('playlist', { populated: true })
    const wrapper = mount(Component, { data: () => ({ playlist }) })

    await wrapper.vm.$nextTick()
    expect(wrapper.has(SongList)).toBe(true)
  })

  it('fetch and populate playlist content on demand', () => {
    const playlist = factory('playlist', { songs: [] })
    shallow(Component)

    const m = mock(playlistStore, 'fetchSongs')
    eventBus.emit('LOAD_MAIN_CONTENT', 'Playlist', playlist)
    expect(m).toHaveBeenCalledWith(playlist)
  })

  it('displays a fallback message if the playlist is empty', () => {
    expect(shallow(Component, {
      data: () => ({
        playlist: factory('playlist', {
          populated: true,
          songs: []
        })
      })
    }).has('div.none')).toBe(true)
  })

  it('emits an event to delete the playlist', () => {
    const playlist = factory('playlist', { populated: true })
    const wrapper = shallow(Component, { data: () => ({ playlist }) })
    const emitMock = mock(eventBus, 'emit')
    wrapper.click('.btn-delete-playlist')
    expect(emitMock).toHaveBeenCalledWith('PLAYLIST_DELETE', playlist)
  })
})
