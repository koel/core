import flushPromises from 'flush-promises'
import factory from '@/__tests__/factory'
import Component from '@/components/ui/album-art-overlay.vue'
import { albumStore } from '@/stores/album'
import { shallow } from '@/__tests__/adapter'
import { mock } from '@/__tests__/__helpers__'
import { eventBus } from '@/utils'
import { events } from '@/config'
import { preferenceStore } from '@/stores'

describe('components/ui/album-art-overlay', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('requests album thumbnail when a song starts playing', async () => {
    preferenceStore.state.showAlbumArtOverlay = true
    const wrapper = shallow(Component)
    const song = factory<Song>('song')
    const getCoverThumbnailMock = mock(albumStore, 'getThumbnail').mockResolvedValue('http://localhost/foo_thumb.jpg')
    eventBus.emit(events.SONG_STARTED, song)
    await flushPromises()
    expect(getCoverThumbnailMock).toHaveBeenCalledWith(song.album)
    expect(wrapper).toMatchSnapshot()
  })

  it('doesnt request album thumbnail if user preference is set to not displaying album art overlay', async () => {
    preferenceStore.state.showAlbumArtOverlay = false
    shallow(Component)
    const song = factory<Song>('song')
    const getCoverThumbnailMock = mock(albumStore, 'getThumbnail')
    eventBus.emit(events.SONG_STARTED, song)
    await flushPromises()
    expect(getCoverThumbnailMock).not.toHaveBeenCalled()
  })
})
