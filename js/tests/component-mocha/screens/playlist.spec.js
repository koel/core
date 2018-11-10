import Component from '@/components/screens/playlist.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { event, alerts } from '@/utils'
import { playlistStore } from '@/stores'

describe('components/screens/playlist', () => {
  it('renders properly', async done => {
    const playlist = factory('playlist', { populated: true })
    const wrapper = await shallow(Component, { data: () => ({ playlist }) })

    Vue.nextTick(() => {
      wrapper.find('h1.heading').html().should.contain(playlist.name)
      wrapper.has(SongList).should.be.true
      done()
    })
  })

  it('fetch and populate playlist content on demand', () => {
    const playlist = factory('playlist', { songs: [] })
    shallow(Component)

    const fetchSongsStub = stub(playlistStore, 'fetchSongs')
    event.emit('LOAD_MAIN_CONTENT', 'playlist', playlist)
    fetchSongsStub.calledWith(playlist).should.be.true
    fetchSongsStub.restore()
  })

  it('displays a fallback message if the playlist is empty', () => {
    shallow(Component, {
      data: () => ({
        playlist: factory('playlist', {
          populated: true,
          songs: []
        })
      })
    }).has('div.none').should.be.true
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

    Vue.nextTick(() => {
      const confirmStub = stub(alerts, 'confirm')
      wrapper.click('.btn-delete-playlist')
      confirmStub.calledWith('Are you sure? This is a one-way street!', wrapper.vm.destroy).should.be.true
      confirmStub.restore()
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

    Vue.nextTick(() => {
      const confirmStub = stub(alerts, 'confirm')
      wrapper.click('.btn-delete-playlist')
      confirmStub.called.should.be.false
      confirmStub.restore()
      done()
    })
  })
})
