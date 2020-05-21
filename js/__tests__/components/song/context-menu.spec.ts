import each from 'jest-each'
import Component from '@/components/song/context-menu.vue'
import { download } from '@/services'
import { songStore, playlistStore, queueStore, favoriteStore, sharedStore, userStore } from '@/stores'
import { eventBus } from '@/utils'
import factory from '@/__tests__/factory'
import { mock } from '@/__tests__/__helpers__'
import { mount, shallow, Wrapper } from '@/__tests__/adapter'

describe('components/song/context-menu', () => {
  let songs: Song[], wrapper: Wrapper

  beforeEach(() => {
    userStore.current.is_admin = true
    sharedStore.state.allowDownload = true
    songs = factory<Song>('song', 2)

    wrapper = mount(Component, {
      propsData: { songs },
      data: () => ({ copyable: true })
    })
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
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
    expect(shallow(Component, { propsData: { songs } }).hasAll(...selectors)).toBe(true)
  })

  each([
    ['after current', '.after-current', 'queueAfterCurrent'],
    ['to bottom', '.bottom-queue', 'queue'],
    ['to top', '.top-queue', 'queueToTop']
  ]).test('queues songs %s when "%s" is clicked', (to, selector, queueFunc) => {
    const m = mock(queueStore, queueFunc)
    wrapper.click(selector)
    expect(m).toHaveBeenCalledWith(songs)
  })

  it('adds songs to favorite', () => {
    const m = mock(favoriteStore, 'like')
    wrapper.click('.favorite')
    expect(m).toHaveBeenCalledWith(songs)
  })

  it('adds songs to existing playlist', () => {
    playlistStore.all = factory<Playlist>('playlist', 5)
    const m = mock(playlistStore, 'addSongs')
    const html = wrapper.html()
    playlistStore.all.forEach(playlist => expect(html).toMatch(playlist.name))
    wrapper.click('.playlist')
    expect(m).toHaveBeenCalledWith(playlistStore.all[0], songs)
  })

  it('opens the edit form', () => {
    const m = mock(eventBus, 'emit')
    userStore.current.is_admin = true
    wrapper.click('.open-edit-form')
    expect(m).toHaveBeenCalledWith('MODAL_SHOW_EDIT_SONG_FORM', songs)
  })

  it('downloads', () => {
    const m = mock(download, 'fromSongs')
    wrapper.click('.download')
    expect(m).toHaveBeenCalledWith(songs)
  })

  it('copies URL', () => {
    const getShareableUrlMock = mock(songStore, 'getShareableUrl')
    const execCommandMock = mock(document, 'execCommand')

    const song = factory('song')
    wrapper.setProps({ songs: [song] })
    wrapper.click('.copy-url')
    expect(getShareableUrlMock).toHaveBeenCalledWith(song)
    expect(execCommandMock).toHaveBeenCalledWith('copy')
  })
})
