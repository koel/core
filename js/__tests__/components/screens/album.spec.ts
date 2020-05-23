import Vue from 'vue'
import Component from '@/components/screens/album.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'
import { download, albumInfo as albumInfoService, playback } from '@/services'
import factory from '@/__tests__/factory'
import { mock } from '@/__tests__/__helpers__'
import { mount, shallow } from '@/__tests__/adapter'

describe('components/screens/album', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', async () => {
    const album = factory<Album>('album')
    const wrapper = mount(Component, {
      propsData: { album }
    })

    await wrapper.vm.$nextTick()
    const html = wrapper.html()
    expect(html).toMatch(album.name)
    expect(html).toMatch(album.artist.name)
    expect(wrapper.hasAll(SongList, SongListControls)).toBe(true)
  })

  it('plays all songs', async () => {
    const songs = factory<Song>('song', 5)
    const album = factory<Album>('album', { songs })

    const wrapper = mount(Component, {
      propsData: { album },
      mocks: {
        $refs: {
          songList: Vue.extend({
            methods: {
              getAllSongsWithSort: () => songs
            }
          })
        }
      }
    })

    const queueAndPlayMock = mock(playback, 'queueAndPlay')
    await wrapper.vm.$nextTick()
    wrapper.click('.btn-shuffle-all')
    expect(queueAndPlayMock).toHaveBeenCalledWith(songs, true)
  })

  it('loads info from Last.fm', () => {
    const album = factory<Album>('album', { info: null })
    const wrapper = shallow(Component, {
      propsData: { album },
      data: () => ({
        sharedState: { useLastfm: true }
      })
    })
    const m = mock(albumInfoService, 'fetch')
    wrapper.click('a.info')
    expect(m).toHaveBeenCalledWith(album)
  })

  it('allows downloading', () => {
    const album = factory<Album>('album')
    const wrapper = shallow(Component, {
      propsData: { album },
      data: () => ({
        sharedState: { allowDownload: true }
      })
    })
    const m = mock(download, 'fromAlbum')
    wrapper.click('a.download')
    expect(m).toHaveBeenCalledWith(album)
  })
})
