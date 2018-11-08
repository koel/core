import Component from '@/components/song/menu.vue'
import { download } from '@/services'
import { songStore, playlistStore, queueStore, favoriteStore, sharedStore, userStore } from '@/stores'
import { event } from '@/utils'
import factory from '@/tests/factory'

describe('components/song/menu', () => {
  let songs

  beforeEach(() => {
    songs = factory('song', 2)
  })

  it('renders properly', () => {
    const selectors = [
      '.playback',
      '.go-to-album',
      '.go-to-artist',
      '.after-current',
      '.bottom-queue',
      '.top-queue',
      '.favorite'
    ]
    shallow(Component, { propsData: { songs }}).hasAll(...selectors).should.be.true
  })

  it('queues songs after current', () => {
    const queueStub = stub(queueStore, 'queueAfterCurrent')
    shallow(Component, { propsData: { songs }}).click('.after-current')
    queueStub.calledWith(songs).should.be.true
    queueStub.restore()
  })

  it('queues songs to bottom', () => {
    const queueStub = stub(queueStore, 'queue')
    shallow(Component, { propsData: { songs }}).click('.bottom-queue')
    queueStub.calledWith(songs).should.be.true
    queueStub.restore()
  })

  it('queues songs to top', () => {
    const queueStub = stub(queueStore, 'queue')
    shallow(Component, { propsData: { songs }}).click('.top-queue')
    queueStub.calledWith(songs, false, true).should.be.true
    queueStub.restore()
  })

  it('adds songs to favorite', () => {
    const likeStub = stub(favoriteStore, 'like')
    shallow(Component, { propsData: { songs }}).click('.favorite')
    likeStub.calledWith(songs).should.be.true
    likeStub.restore()
  })

  it('adds songs to existing playlist', () => {
    playlistStore.all = factory('playlist', 5)
    const addStub = stub(playlistStore, 'addSongs')
    const wrapper = shallow(Component, { propsData: { songs }})
    const html = wrapper.html()
    playlistStore.all.forEach(playlist => html.should.contain(playlist.name))
    wrapper.click('.playlist')
    addStub.calledWith(playlistStore.all[0], songs).should.be.true
    addStub.restore()
  })

  it('opens the edit form', () => {
    const emitStub = stub(event, 'emit')
    userStore.current.is_admin = true
    const wrapper = shallow(Component, { propsData: { songs }})
    wrapper.click('.open-edit-form')
    emitStub.calledWith('EDIT_SONGS', songs).should.be.true
    emitStub.restore()
  })

  it('downloads', () => {
    const downloadStub = stub(download, 'fromSongs')
    sharedStore.state.allowDownload = true
    const wrapper = shallow(Component, { propsData: { songs }})
    wrapper.click('.download')
    downloadStub.calledWith(songs).should.be.true
    downloadStub.restore()
  })

  it('copies URL', () => {
    const getUrlStub = stub(songStore, 'getShareableUrl')
    const song = factory('song')
    const wrapper = shallow(Component, {
      propsData: { songs: [song] },
      data: () => ({ copyable: true })
    })
    wrapper.click('.copy-url')
    getUrlStub.calledWith(song).should.be.true
  })
})
