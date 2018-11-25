import Component from '@/components/song/edit-form.vue'
import Typeahead from '@/components/ui/typeahead.vue'
import factory from '@/tests/factory'
import { songStore } from '@/stores'
import { songInfo } from '@/services/info'
import { mock } from '@/tests/__helpers__'

describe('components/song/edit-form', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('supports editing a single song', async done => {
    const song = factory('song', { infoRetrieved: true })
    const wrapper = await mount(Component, {
      propsData: { songs: song }
    })

    wrapper.vm.$nextTick(() => {
      const metaHtml = wrapper.find('.meta').html()
      expect(metaHtml).toMatch(song.title)
      expect(metaHtml).toMatch(song.album.name)
      expect(metaHtml).toMatch(song.artist.name)

      expect(wrapper.has(Typeahead)).toBe(true)
      expect(wrapper.find('input[name=title]').value).toBe(song.title)
      expect(wrapper.find('input[name=album]').value).toBe(song.album.name)
      expect(wrapper.find('input[name=artist]').value).toBe(song.artist.name)
      expect(wrapper.find('input[name=track]').value).toBe(song.track.toString())

      wrapper.click('.tabs .tab-lyrics')
      expect(wrapper.find('textarea[name=lyrics]').value).toBe(song.lyrics)
      done()
    })
  })

  it('fetches song information on demand', () => {
    const song = factory('song', { infoRetrieved: false })
    const fetchMock = mock(songInfo, 'fetch')
    mount(Component, {
      propsData: { songs: song }
    })
    expect(fetchMock).toHaveBeenCalledWith(song)
  })

  it('supports editing multiple songs of multiple artists', () => {
    const wrapper = mount(Component, {
      propsData: {
        songs: factory('song', 3)
      }
    })

    const metaHtml = wrapper.find('.meta').html()
    expect(metaHtml).toMatch('3 songs selected')
    expect(metaHtml).toMatch('Mixed Artists')
    expect(metaHtml).toMatch('Mixed Albums')

    expect(wrapper.find('input[name=artist]').value).toBe('')
    expect(wrapper.find('input[name=album]').value).toBe('')
    expect(wrapper.has('.tabs .tab-lyrics')).toBe(false)
  })

  it('supports editing multiple songs of same artist and different albums', () => {
    const artist = factory('artist')
    const wrapper = mount(Component, {
      propsData: {
        songs: factory('song', 5, {
          artist,
          artist_id: artist.id
        })
      }
    })

    const metaHtml = wrapper.find('.meta').html()
    expect(metaHtml).toMatch('5 songs selected')
    expect(metaHtml).toMatch(artist.name)
    expect(metaHtml).toMatch('Mixed Albums')

    expect(wrapper.find('input[name=artist]').value).toBe(artist.name)
    expect(wrapper.find('input[name=album]').value).toBe('')
    expect(wrapper.has('.tabs .tab-lyrics')).toBe(false)
  })

  it('supports editing multiple songs in same album', () => {
    const album = factory('album')
    const wrapper = mount(Component, {
      propsData: {
        songs: factory('song', 4, {
          album,
          album_id: album.id,
          artist: album.artist,
          artist_id: album.artist.id
        })
      }
    })

    const metaHtml = wrapper.find('.meta').html()
    expect(metaHtml).toMatch('4 songs selected')
    expect(metaHtml).toMatch(album.name)
    expect(metaHtml).toMatch(album.artist.name)

    expect(wrapper.find('input[name=artist]').value).toBe(album.artist.name)
    expect(wrapper.find('input[name=album]').value).toBe(album.name)
    expect(wrapper.has('.tabs .tab-lyrics')).toBe(false)
  })

  it('saves', async done => {
    const updateStub = mock(songStore, 'update')
    const songs = factory('song', 3)
    const formData = { foo: 'bar' }
    const wrapper = await mount(Component, {
      data: () => ({ formData }),
      propsData: {
        songs
      }
    })
    wrapper.submit('form')
    expect(updateStub).toHaveBeenCalledWith(songs, formData)
    done()
  })

  it('closes', () => {
    const wrapper = shallow(Component, {
      propsData: {
        songs: factory('song', 3)
      }
    })
    wrapper.click('.btn-cancel')
    expect(wrapper.hasEmitted('close')).toBe(true)
  })
})
