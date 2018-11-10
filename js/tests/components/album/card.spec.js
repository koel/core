import each from 'jest-each'
import Component from '@/components/album/card.vue'
import factory from '@/tests/factory'
import { playback, download } from '@/services'
import { queueStore, sharedStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

describe('components/album/card', () => {
  let album
  let wrapper

  beforeEach(() => {
    album = factory('album', {
      songs: factory('song', 10)
    })
    sharedStore.state = { allowDownload: true }
    wrapper = shallow(Component, { propsData: { album }})
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    expect(wrapper.has('span.cover')).toBe(true)
    const html = wrapper.html()
    expect(html).toMatch(album.name)
    expect(html).toMatch('10 songs')
  })

  it('plays if clicked', () => {
    const m = mock(playback, 'playAllInAlbum')
    wrapper.click('.control-play')
    expect(m).toHaveBeenCalledWith(album, false)
  })

  each([['metaKey'], ['ctrlKey']]).test('queues if %s is clicked', key => {
    const m = mock(queueStore, 'queue')
    wrapper.click('.control-play', { [key]: true })
    expect(m).toHaveBeenCalled()
  })

  it('shuffles', () => {
    const m = mock(playback, 'playAllInAlbum')
    wrapper.click('.shuffle-album')
    expect(m).toHaveBeenCalledWith(album, true)
  })

  it('downloads', () => {
    const m = mock(download, 'fromAlbum')
    wrapper.click('.download-album')
    expect(m).toHaveBeenCalledWith(album)
  })
})
