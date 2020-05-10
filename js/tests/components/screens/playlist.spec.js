import Component from '@/components/screens/playlist'
import SongList from '@/components/song/list'
import factory from '@/tests/factory'
import { event } from '@/utils'
import { playlistStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

describe('components/screens/playlist', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async done => {
    const playlist = factory('playlist', { populated: true })
    const wrapper = await mount(Component, { data: () => ({ playlist }) })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('h1.heading').html()).toMatch(playlist.name)
      expect(wrapper.has(SongList)).toBe(true)
      done()
    })
  })

  it('fetch and populate playlist content on demand', () => {
    const playlist = factory('playlist', { songs: [] })
    shallow(Component)

    const m = mock(playlistStore, 'fetchSongs')
    event.emit('LOAD_MAIN_CONTENT', 'Playlist', playlist)
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

  it('emits an event to delete the playlist', async done => {
    const playlist = factory('playlist', { populated: true })
    const wrapper = await shallow(Component, { data: () => ({ playlist }) })
    const emitMock = mock(event, 'emit')
    wrapper.click('.btn-delete-playlist')
    wrapper.vm.$nextTick(() => {
      expect(emitMock).toHaveBeenCalledWith('PLAYLIST_DELETE', playlist)
      done()
    })
  })
})
