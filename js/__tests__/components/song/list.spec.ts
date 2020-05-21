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

    // @ts-ignore
    wrapper.vm.sort()
    // @ts-ignore
    expect(wrapper.vm.sortKey).toContain('song.disc')
  })

  each([
    ['foo', 'foo', ['song.title', 'song.album.name', 'song.artist.name']],
    ['foo in:title', 'foo', ['song.title']],
    ['in:album foo bar', 'foo bar', ['song.album.name']],
    ['foo bar in:artist', 'foo bar', ['song.artist.name']],
    ['foo in:album in:artist', 'foo', ['song.album.name', 'song.artist.name']]
  ]).test('parses query "%s" into keyword "%s" and proper search fields', (q, keywords, fields) => {
    const wrapper = shallow(Component, {
      propsData: {
        items: songs,
        type: 'all-songs'
      }
    })

    // @ts-ignore
    expect(wrapper.vm.extractSearchDataFromQuery(q)).toEqual({ keywords, fields })
  })

  it('plays when Enter is pressed with one selected song', () => {
    const wrapper = mount(Component, {
      propsData: {
        items: songs,
        type: 'all-songs'
      }
    })
    // select one row
    // @ts-ignore
    wrapper.vm.filteredItems[0].selected = true

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
    // @ts-ignore
    wrapper.vm.filteredItems[0].selected = true
    // @ts-ignore
    wrapper.vm.filteredItems[1].selected = true
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
    // @ts-ignore
    wrapper.vm.filteredItems[0].selected = true
    // @ts-ignore
    wrapper.vm.filteredItems[1].selected = true

    // simple Enter adds selected songs to bottom
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    // @ts-ignore
    expect(queueMock).toHaveBeenCalledWith(wrapper.vm.selectedSongs)
    // the current screen should be switched to "Queue"
    expect(goMock).toHaveBeenCalledWith('queue')

    // Shift+Enter queues to top
    const queueToTopMock = mock(queueStore, 'queueToTop')
    wrapper.find('.song-list-wrap').trigger('keydown.enter', { shiftKey: true })
    // @ts-ignore
    expect(queueToTopMock).toHaveBeenCalledWith(wrapper.vm.selectedSongs)
    expect(goMock).toHaveBeenCalledWith('queue')

    // Ctrl[+Shift]+Enter queues and plays the first song
    wrapper.find('.song-list-wrap').trigger('keydown.enter', { ctrlKey: true })
    // @ts-ignore
    expect(playMock).toHaveBeenCalledWith(wrapper.vm.selectedSongs[0])
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
    wrapper.vm.filteredItems.forEach(item => expect(item.selected).toBe(true))
  })
})
