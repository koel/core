import each from 'jest-each'
import router from '@/router'
import Component from '@/components/song/list'
import factory from '@/tests/factory'
import { event } from '@/utils'
import { songStore, queueStore } from '@/stores'
import { playback } from '@/services'
import { mock } from '@/tests/__helpers__'
import { shallowMount } from '@vue/test-utils'
import * as filters from '@/utils/filters.js'

describe('components/song/list', () => {
  let songs

  beforeEach(() => {
    songs = factory('song', 20)
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('informs parent to update meta data', () => {
    const emitStub = mock(event, 'emit')
    const getLengthStub = mock(songStore, 'getFormattedLength', '12:34:56')
    mount(Component, { propsData: {
      items: songs,
      type: 'all-songs'
    }})

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
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'all-songs'
    }})
    const m = mock(wrapper.vm, 'sort')
    wrapper.click(`.song-list-header ${selector}`)
    expect(m).toHaveBeenCalledWith(criteria)
  })

  it('takes disc into account when sort an album song list', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'album'
    }})

    wrapper.vm.sort()
    expect(wrapper.vm.sortKey).toContain('song.disc')
  })

  each([
    ['foo', 'foo', ['song.title', 'song.album.name', 'song.artist.name']],
    ['foo in:title', 'foo', ['song.title']],
    ['in:album foo bar', 'foo bar', ['song.album.name']],
    ['foo bar in:artist', 'foo bar', ['song.artist.name']],
    ['foo in:album in:artist', 'foo', ['song.album.name', 'song.artist.name']]
  ]).test('parses query "%s" into keyword "%s" and proper search fields', (q, keywords, fields) => {
    const wrapper = shallow(Component, { propsData: {
      items: songs,
      type: 'all-songs'
    }})

    expect(wrapper.vm.extractSearchDataFromQuery(q)).toEqual({ keywords, fields })
  })

  it('plays when Enter is pressed with one selected song', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'all-songs'
    }})
    // select one row
    wrapper.vm.filteredItems[0].selected = true

    const m = mock(playback, 'play')
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    expect(m).toHaveBeenCalledWith(songs[0])
  })

  it('plays when Enter is pressed in Queue screen', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'queue'
    }})

    const m = mock(playback, 'play')
    wrapper.vm.filteredItems[0].selected = true
    wrapper.vm.filteredItems[1].selected = true
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    expect(m).toHaveBeenCalledWith(songs[0])
  })

  it('queues when Enter is pressed in other screens', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'playlist'
    }})
    const queueMock = mock(queueStore, 'queue')
    const goMock = mock(router, 'go')
    const playMock = mock(playback, 'play')

    // select 2 rows
    wrapper.vm.filteredItems[0].selected = true
    wrapper.vm.filteredItems[1].selected = true

    // simple Enter adds selected songs to bottom
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    expect(queueMock).toHaveBeenCalledWith(wrapper.vm.selectedSongs)
    // the current screen should be switched to "Queue"
    expect(goMock).toHaveBeenCalledWith('queue')

    // Shift+Enter queues to top
    const queueToTopMock = mock(queueStore, 'queueToTop')
    wrapper.find('.song-list-wrap').trigger('keydown.enter', { shiftKey: true })
    expect(queueToTopMock).toHaveBeenCalledWith(wrapper.vm.selectedSongs)
    expect(goMock).toHaveBeenCalledWith('queue')

    // Ctrl[+Shift]+Enter queues and plays the first song
    wrapper.find('.song-list-wrap').trigger('keydown.enter', { ctrlKey: true })
    expect(playMock).toHaveBeenCalledWith(wrapper.vm.selectedSongs[0])
  })

  it('selects all songs', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'playlist'
    }})
    wrapper.find('.song-list-wrap').trigger('keydown.a', { ctrlKey: true })
    wrapper.vm.filteredItems.forEach(item => expect(item.selected).toBe(true))
  })

  describe(`mounted()`, () => {
    let orderBy
    beforeEach(() => {
      orderBy = jest.spyOn(filters, "orderBy")
    })

    it(`does not sort when sorting is disallowed`, () => {
      shallowMount(Component, {
        propsData: {
          items: songs,
          type: "queue",
          sortable: false
        }
      })

      expect(orderBy).not.toHaveBeenCalled()
    })

    it(`will not sort songs by default`, () => {
      shallowMount(Component, {
        propsData: {
          items: songs,
          type: "all-songs"
        }
      })

      expect(orderBy).toHaveBeenCalledWith(expect.any(Array), "", 1)
    })

    it('sorts songs by track and disc number in album song list', () => {
      shallowMount(Component, {
        propsData: {
          items: songs,
          type: "album"
        }
      })

      expect(orderBy).toHaveBeenCalledWith(
        expect.any(Array),
        ["song.disc", "song.track"],
        1
      )
    })
  })

  describe(`sort()`, () => {
    let orderBy
    beforeEach(() => {
      orderBy = jest.spyOn(filters, "orderBy")
    })

    it(`does not sort when sorting is disallowed`, () => {
      const wrapper = shallowMount(Component, {
        propsData: {
          items: songs,
          type: "queue",
          sortable: false
        }
      })

      wrapper.vm.sort()

      expect(orderBy).not.toHaveBeenCalled()
    })

    it(`sorts song rows by data's sortKey and inverts order`, () => {
      const wrapper = shallowMount(Component, {
        propsData: {
          items: songs,
          type: "all-songs"
        }
      })
      wrapper.setData({ sortKey: "song.track" })

      wrapper.vm.sort()

      expect(orderBy).toHaveBeenCalledWith(expect.any(Array), "song.track", 1)
    })

    it(`toggles sortingByAlbum if sortKey's first part is 'song.album.name'`, () => {
      const wrapper = shallowMount(Component, {
        propsData: {
          items: songs,
          type: "all-songs"
        }
      })
      wrapper.setData({ sortKey: ["song.album.name", "song.track"] })

      wrapper.vm.sort()

      expect(wrapper.vm.sortingByAlbum).toBe(true)
    })

    it(`toggles sortingByArtist if sortKey's first part is 'song.album.artist.name'`, () => {
      const wrapper = shallowMount(Component, {
        propsData: {
          items: songs,
          type: "all-songs"
        }
      })
      wrapper.setData({
        sortKey: ["song.album.artist.name", "song.album.name", "song.track"]
      })

      wrapper.vm.sort()

      expect(wrapper.vm.sortingByArtist).toBe(true)
    })

    it(`sets the key parameter as sortKey and inverts order`, () => {
      const wrapper = shallowMount(Component, {
        propsData: {
          items: songs,
          type: "all-songs"
        }
      })

      wrapper.vm.sort("song.title")

      expect(orderBy).toHaveBeenCalledWith(expect.any(Array), "song.title", -1)
    })
  })
})
