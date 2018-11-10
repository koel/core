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

  it('opens', () => {
    const wrapper = shallow(Component)
    wrapper.vm.open(factory('song', 3))
    expect(wrapper.has('form')).toBe(true)
  })

  it('supports editing a single song', async done => {
    const song = factory('song', { infoRetrieved: true })
    const wrapper = await mount(Component)
    wrapper.vm.open(song)

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

  it('fetches song information on demand', () => {
    const song = factory('song', { infoRetrieved: false })
    const fetchMock = mock(songInfo, 'fetch')
    const wrapper = mount(Component)
    wrapper.vm.open(song)
    expect(fetchMock).toHaveBeenCalledWith(song)
  })

  it('supports editing multiple songs of multiple artists', () => {
    const wrapper = mount(Component)
    wrapper.vm.open(factory('song', 3))

    const metaHtml = wrapper.find('.meta').html()
    expect(metaHtml).toMatch('3 songs selected')
    expect(metaHtml).toMatch('Mixed Artists')
    expect(metaHtml).toMatch('Mixed Albums')

    expect(wrapper.find('input[name=artist]').value).toBe('')
    expect(wrapper.find('input[name=album]').value).toBe('')
    expect(wrapper.has('.tabs .tab-lyrics')).toBe(false)
  })

  it('supports editing multiple songs of same artist and different albums', () => {
    const wrapper = mount(Component)
    const artist = factory('artist')
    const songs = factory('song', 5, {
      artist,
      artist_id: artist.id
    })
    wrapper.vm.open(songs)

    const metaHtml = wrapper.find('.meta').html()
    expect(metaHtml).toMatch('5 songs selected')
    expect(metaHtml).toMatch(artist.name)
    expect(metaHtml).toMatch('Mixed Albums')

    expect(wrapper.find('input[name=artist]').value).toBe(artist.name)
    expect(wrapper.find('input[name=album]').value).toBe('')
    expect(wrapper.has('.tabs .tab-lyrics')).toBe(false)
  })

  it('supports editing multiple songs in same album', () => {
    const wrapper = mount(Component)
    const album = factory('album')
    const songs = factory('song', 4, {
      album,
      album_id: album.id,
      artist: album.artist,
      artist_id: album.artist.id
    })
    wrapper.vm.open(songs)

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
      data: () => ({ formData })
    })
    await wrapper.vm.open(songs)
    wrapper.submit('form')
    expect(updateStub).toHaveBeenCalledWith(songs, formData)
    done()
  })

  it('closes', async done => {
    const wrapper = shallow(Component)
    await wrapper.vm.open(factory('song', 3))
    expect(wrapper.has('form')).toBe(true)
    await wrapper.vm.close()
    expect(wrapper.has('form')).toBe(false)
    done()
  })
})
