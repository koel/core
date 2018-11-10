import _ from 'lodash'
import Component from '@/components/song/add-to-menu.vue'
import factory from '@/tests/factory'
import { playlistStore, queueStore, favoriteStore } from '@/stores'
import { mockAsNoop } from '@/tests/__helpers__'

describe('components/song/add-to-menu', () => {
  const config = {
    queue: true,
    favorites: true,
    playlists: true,
    newPlaylist: true
  }

  let songs

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  const initComponent = (customConfig = {}, func = shallow) => {
    songs = factory('song', 5)
    return func(Component, { propsData: {
      songs,
      config: _.assign(_.clone(config), customConfig),
      showing: true
    }})
  }

  it('renders', () => {
    playlistStore.all = factory('playlist', 10)
    const wrapper = initComponent()
    expect(wrapper.html()).toMatch('Add 5 songs to')
    expect(wrapper.hasAll(
      'li.after-current',
      'li.bottom-queue',
      'li.top-queue',
      'li.favorites',
      'form.form-new-playlist'
    )).toBe(true)
    expect(wrapper.findAll('li.playlist').length).toBe(10)
  })

  it('supports different configurations', () => {
    // add to queue
    let wrapper = initComponent({ queue: false })
    expect(wrapper.hasNone('li.after-current', 'li.bottom-queue', 'li.top-queue')).toBe(true)

    // add to favorites
    wrapper = initComponent({ favorites: false })
    expect(wrapper.has('li.favorites')).toBe(false)

    // add to playlists
    wrapper = initComponent({ playlists: false })
    expect(wrapper.has('li.playlist')).toBe(false)

    // add to a new playlist
    wrapper = initComponent({ newPlaylist: false })
    expect(wrapper.has('form.form-new-playlist')).toBe(false)
  })

  it('queue songs after current and closes itself', () => {
    const wrapper = initComponent()
    const queueStub = mockAsNoop(queueStore, 'queueAfterCurrent')
    const closeStub = mockAsNoop(wrapper.vm, 'close')
    wrapper.click('li.after-current')
    expect(queueStub).toHaveBeenCalledWith(songs)
    expect(closeStub).toHaveBeenCalled()
  })

  it('queue songs to bottom and closes itself', () => {
    const wrapper = initComponent()
    const queueStub = mockAsNoop(queueStore, 'queue')
    const closeStub = mockAsNoop(wrapper.vm, 'close')
    wrapper.click('li.bottom-queue')
    expect(queueStub).toHaveBeenCalledWith(songs)
    expect(closeStub).toHaveBeenCalled()
  })

  it('queue songs to top and closes itself', () => {
    const wrapper = initComponent()
    const queueStub = mockAsNoop(queueStore, 'queue')
    const closeStub = mockAsNoop(wrapper.vm, 'close')
    wrapper.click('li.top-queue')
    expect(queueStub).toHaveBeenCalledWith(songs, false, true)
    expect(closeStub).toHaveBeenCalled()
  })

  it('add songs to favorite', () => {
    const wrapper = initComponent()
    const likeStub = mockAsNoop(favoriteStore, 'like')
    const closeStub = mockAsNoop(wrapper.vm, 'close')
    wrapper.click('li.favorites')
    expect(likeStub).toHaveBeenCalledWith(songs)
    expect(closeStub).toHaveBeenCalled()
  })

  it('add songs to existing playlist', () => {
    const playlists = factory('playlist', 3)
    playlistStore.all = playlists
    const wrapper = initComponent()
    const addSongsStub = mockAsNoop(playlistStore, 'addSongs')
    const closeStub = mockAsNoop(wrapper.vm, 'close')
    wrapper.findAll('li.playlist').at(1).click()
    expect(addSongsStub).toHaveBeenCalledWith(playlists[1], songs)
    expect(closeStub).toHaveBeenCalled()
  })

  it('creates new playlist from songs', async done => {
    const storeStub = jest.spyOn(playlistStore, 'store')
    storeStub.mockReturnValueOnce(new Promise(resolve => resolve(factory('playlist'))))
    const wrapper = initComponent()
    const closeStub = mockAsNoop(wrapper.vm, 'close')
    wrapper.setData({ newPlaylistName: 'Foo' })
    await wrapper.submit('form.form-new-playlist')
    expect(storeStub).toHaveBeenCalledWith('Foo', songs)
    expect(closeStub).toHaveBeenCalled()
    done()
  })
})
