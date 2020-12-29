import each from 'jest-each'
import router from '@/router'
import Component from '@/components/song/list.vue'
import factory from '@/__tests__/factory'
import { eventBus } from '@/utils'
import { songStore, queueStore } from '@/stores'
import { playback } from '@/services'
import { mock } from '@/__tests__/__helpers__'
import { mount, shallow } from '@/__tests__/adapter'

describe('components/song/list', () => {
  let songs: Song[]

  beforeEach(() => {
    songs = factory<Song>('song', 20)
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('informs parent to update meta data', () => {
    const emitStub = mock(eventBus, 'emit')
    const getLengthStub = mock(songStore, 'getFormattedLength', '12:34:56')
    mount(Component, {
      propsData: {
        items: songs,
        type: 'all-songs'
      }
    })

    expect(getLengthStub).toHaveBeenCalledWith(songs)
    expect(emitStub).toHaveBeenCalled()
  })

  each([
    ['.track-number', 'song.track'],
    ['.title', 'song.title'],
    ['.artist', ['song.album.artist.name', 'song.album.name', 'song.track']],
    ['.album', ['song.album.name', 'song.track']],
    ['.time', 'song.length']
  ]).test('sorts when "%s" is clicked', (selector, criteria) => {
    const wrapper = mount(Component, {
      propsData: {
        items: songs,
        type: 'all-songs'
      }
    })
    // @ts-ignore
    const m = mock(wrapper.vm, 'sort')
    wrapper.click(`.song-list-header ${selector}`)
    expect(m).toHaveBeenCalledWith(criteria)
  })

  it('takes disc into account when sort an album song list', () => {
    const wrapper = mount(Component, {
      propsData: {
        items: songs,
        type: 'album'
      }
    })

    ;(wrapper.vm as any).sort()
    expect((wrapper.vm as any).sortKey).toContain('song.disc')
  })

  it('plays when Enter is pressed with one selected song', () => {
    const wrapper = mount(Component, {
      propsData: {
        items: songs,
        type: 'all-songs'
      }
    })
    // select one row
    ;(wrapper.vm as any).songProxies[0].selected = true

    const m = mock(playback, 'play')
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    expect(m).toHaveBeenCalledWith(songs[0])
  })

  it('plays when Enter is pressed in Queue screen', () => {
    const wrapper = mount(Component, {
      propsData: {
        items: songs,
        type: 'queue'
      }
    })

    const m = mock(playback, 'play')
    ;(wrapper.vm as any).songProxies[0].selected = true
    ;(wrapper.vm as any).songProxies[1].selected = true
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    expect(m).toHaveBeenCalledWith(songs[0])
  })

  it('queues when Enter is pressed in other screens', () => {
    const wrapper = mount(Component, {
      propsData: {
        items: songs,
        type: 'playlist'
      }
    })
    const queueMock = mock(queueStore, 'queue')
    const goMock = mock(router, 'go')
    const playMock = mock(playback, 'play')

    // select 2 rows
    ;(wrapper.vm as any).songProxies[0].selected = true
    ;(wrapper.vm as any).songProxies[1].selected = true

    // simple Enter adds selected songs to bottom
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    expect(queueMock).toHaveBeenCalledWith((wrapper.vm as any).selectedSongs)
    // the current screen should be switched to "Queue"
    expect(goMock).toHaveBeenCalledWith('queue')

    // Shift+Enter queues to top
    const queueToTopMock = mock(queueStore, 'queueToTop')
    wrapper.find('.song-list-wrap').trigger('keydown.enter', { shiftKey: true })
    expect(queueToTopMock).toHaveBeenCalledWith((wrapper.vm as any).selectedSongs)
    expect(goMock).toHaveBeenCalledWith('queue')

    // Ctrl[+Shift]+Enter queues and plays the first song
    wrapper.find('.song-list-wrap').trigger('keydown.enter', { ctrlKey: true })
    expect(playMock).toHaveBeenCalledWith((wrapper.vm as any).selectedSongs[0])
  })

  it('selects all songs', () => {
    const wrapper = mount(Component, {
      propsData: {
        items: songs,
        type: 'playlist'
      }
    })
    wrapper.find('.song-list-wrap').trigger('keydown.a', { ctrlKey: true })
    // @ts-ignore
    wrapper.vm.songProxies.forEach(item => expect(item.selected).toBe(true))
  })
})
