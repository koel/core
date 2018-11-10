import Component from '@/components/album/card.vue'
import factory from '@/tests/factory'
import { playback, download } from '@/services'
import { queueStore, sharedStore } from '@/stores'
import { mockAsNoop } from '@/tests/__helpers__'

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
    expect(html).toContain(album.name)
    expect(html).toContain('10 songs')
  })

  it('plays if clicked', () => {
    const mock = mockAsNoop(playback, 'playAllInAlbum')
    wrapper.click('.control-play')
    expect(mock).toHaveBeenCalledWith(album, false)
  })

  it('queues if ctrl/meta clicked', () => {
    const mock = mockAsNoop(queueStore, 'queue')
    wrapper.click('.control-play', { metaKey: true })
    expect(mock).toHaveBeenCalled()
    wrapper.click('.control-play', { ctrlKey: true })
    expect(mock).toHaveBeenCalled()
  })

  it('shuffles', () => {
    const mock = mockAsNoop(playback, 'playAllInAlbum')
    wrapper.click('.shuffle-album')
    expect(mock).toHaveBeenCalledWith(album, true)
  })

  it('downloads', () => {
    const mock = mockAsNoop(download, 'fromAlbum')
    wrapper.click('.download-album')
    expect(mock).toHaveBeenCalledWith(album)
  })
})
