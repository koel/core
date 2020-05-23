import Vue from 'vue'
import Component from '@/components/screens/artist.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'
import { download, artistInfo as artistInfoService, playback } from '@/services'
import factory from '@/__tests__/factory'
import { mock } from '@/__tests__/__helpers__'
import { mount, shallow } from '@/__tests__/adapter'

describe('components/screens/artist', () => {
  let artist: Artist
  beforeEach(() => {
    artist = factory('artist')
    const album = factory<Album>('album', {
      artist,
      artist_id: artist.id
    })
    artist.albums = [album]
    artist.songs = factory<Song>('song', 5, {
      artist,
      album,
      artist_id: artist.id,
      album_id: album.id
    })
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders upon receiving event', async () => {
    const wrapper = mount(Component, {
      propsData: { artist }
    })

    await wrapper.vm.$nextTick()
    const html = wrapper.html()
    expect(html).toMatch(artist.name)
    expect(html).toMatch('1 album')
    expect(wrapper.hasAll(SongList, SongListControls)).toBe(true)
  })

  it('plays all songs', async () => {
    const songs = factory<Song>('song', 5)
    const artist = factory<Artist>('artist', { songs })

    const wrapper = mount(Component, {
      propsData: { artist },
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
    artist.info = null
    const wrapper = shallow(Component, {
      propsData: { artist },
      data: () => ({
        sharedState: { useLastfm: true }
      })
    })
    const m = mock(artistInfoService, 'fetch')
    wrapper.click('a.info')
    expect(m).toHaveBeenCalledWith(artist)
  })

  it('allows downloading', () => {
    const wrapper = shallow(Component, {
      propsData: { artist },
      data: () => ({
        sharedState: { allowDownload: true }
      })
    })
    const m = mock(download, 'fromArtist')
    wrapper.click('a.download')
    expect(m).toHaveBeenCalledWith(artist)
  })
})
