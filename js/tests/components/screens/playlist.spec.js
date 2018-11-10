import Component from '@/components/screens/playlist.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { event, alerts } from '@/utils'
import { playlistStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

describe('components/screens/playlist', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async done => {
    const playlist = factory('playlist', { populated: true })
    const wrapper = await shallow(Component, { data: () => ({ playlist }) })

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
    event.emit('LOAD_MAIN_CONTENT', 'playlist', playlist)
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

  it('confirms deleting if the playlist is not empty', async done => {
    const wrapper = await mount(Component, {
      data: () => ({
        playlist: factory('playlist', {
          populated: true,
          songs: factory('song', 3)
        }),
        songListControlConfig: {
          deletePlaylist: true
        }
      })
    })

    wrapper.vm.$nextTick(() => {
      const m = mock(alerts, 'confirm')
      wrapper.click('.btn-delete-playlist')
      expect(m).toHaveBeenCalledWith('Are you sure? This is a one-way street!', wrapper.vm.destroy)
      done()
    })
  })

  it("doesn't confirm deleting if the playlist is empty", async done => {
    const playlist = factory('playlist', {
      populated: true,
      songs: []
    })

    const wrapper = await mount(Component, {
      data: () => ({
        playlist
      })
    })

    wrapper.vm.$nextTick(() => {
      const m = mock(alerts, 'confirm')
      wrapper.click('.btn-delete-playlist')
      expect(m).not.toHaveBeenCalled()
      done()
    })
  })
})
