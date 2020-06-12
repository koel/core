import flushPromises from 'flush-promises'
import factory from '@/__tests__/factory'
import Component from '@/components/ui/album-art-overlay.vue'
import { albumStore } from '@/stores/album'
import { shallow } from '@/__tests__/adapter'
import { mock } from '@/__tests__/__helpers__'
import { eventBus } from '@/utils'
import { events } from '@/config'

describe('components/ui/album-art-overlay', () => {
  it('requests album thumbnail when a song starts playing', async () => {
    const wrapper = shallow(Component, { sync: false })
    const song = factory<Song>('song')
    const getCoverThumbnailMock = mock(albumStore, 'getThumbnail').mockResolvedValue('http://localhost/foo_thumb.jpg')
    eventBus.emit(events.SONG_STARTED, song)
    await flushPromises()
    expect(getCoverThumbnailMock).toHaveBeenCalledWith(song.album)
    expect(wrapper).toMatchSnapshot()
  })
})
