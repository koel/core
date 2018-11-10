import Component from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { event } from '@/utils'
import { songStore, queueStore } from '@/stores'
import { playback } from '@/services'
import router from '@/router'

describe.skip('components/song/list', () => {
  let songs

  beforeEach(() => {
    songs = factory('song', 20)
  })

  it('informs parent to update meta data', () => {
    // for some reason .emit is wrapped twice
    const emitStub = event.emit.restore ? event.emit : stub(event, 'emit')
    const getLengthStub = stub(songStore, 'getFormattedLength').callsFake(() => '12:34:56')
    mount(Component, { propsData: {
      items: songs,
      type: 'allSongs'
    }})

    getLengthStub.calledWith(songs).should.be.true
    emitStub.called.should.be.true

    emitStub.restore()
    getLengthStub.restore()
  })

  it('triggers sort', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'allSongs'
    }})
    const sortStub = stub(wrapper.vm, 'sort')
    const provider = {
      '.track-number': 'song.track',
      '.title': 'song.title',
      '.artist': ['song.album.artist.name', 'song.album.name', 'song.track'],
      '.album': ['song.album.name', 'song.track'],
      '.time': 'song.length'
    }
    for (const selector in provider) {
      wrapper.click(`.song-list-header ${selector}`)
      sortStub.calledWith(provider[selector]).should.be.true
    }
  })

  it('takes disc into account when sort an album song list', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'album'
    }})

    wrapper.vm.sort()
    wrapper.vm.sortKey.includes('song.disc').should.be.true
  })

  it('extracts search data from a search query', () => {
    const provider = {
      'foo': { keywords: 'foo', fields: ['song.title', 'song.album.name', 'song.artist.name'] },
      'foo in:title': { keywords: 'foo', fields: ['song.title'] },
      'in:album foo bar': { keywords: 'foo bar', fields: ['song.album.name'] },
      'foo bar in:artist': { keywords: 'foo bar', fields: ['song.artist.name'] },
      'foo in:album in:artist': { keywords: 'foo', fields: ['song.album.name', 'song.artist.name'] }
    }

    const wrapper = shallow(Component, { propsData: {
      items: songs,
      type: 'allSongs'
    }})

    for (const q in provider) {
      wrapper.vm.extractSearchDataFromQuery(q).should.eql(provider[q])
    }
  })

  it('plays when Enter is pressed with one selected song', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'allSongs'
    }})
    // select one row
    wrapper.vm.filteredItems[0].selected = true

    const playStub = stub(playback, 'play')
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    playStub.calledWith(songs[0]).should.be.true
    playStub.restore()
  })

  it('plays when Enter is pressed in Queue screen', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'queue'
    }})

    const playStub = stub(playback, 'play')
    wrapper.vm.filteredItems[0].selected = true
    wrapper.vm.filteredItems[1].selected = true
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    playStub.calledWith(songs[0]).should.be.true
    playStub.restore()
  })

  it('queues when Enter is pressed in other screens', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'playlist'
    }})
    const queueStub = stub(queueStore, 'queue')
    const goStub = stub(router, 'go')
    const playStub = stub(playback, 'play')

    // select 2 rows
    wrapper.vm.filteredItems[0].selected = true
    wrapper.vm.filteredItems[1].selected = true

    // simple Enter adds selected songs to bottom
    wrapper.find('.song-list-wrap').trigger('keydown.enter')
    queueStub.calledWith(wrapper.vm.selectedSongs, false, undefined).should.be.true
    // the current screen should be switched to "Queue"
    goStub.calledWith('queue').should.be.true

    // Shift+Enter queues to top
    wrapper.find('.song-list-wrap').trigger('keydown.enter', { shiftKey: true })
    queueStub.calledWith(wrapper.vm.selectedSongs, false, true).should.be.true
    goStub.calledWith('queue').should.be.true

    // Ctrl[+Shift]+Enter queues and plays the first song
    wrapper.find('.song-list-wrap').trigger('keydown.enter', { ctrlKey: true })
    playStub.calledWith(wrapper.vm.selectedSongs[0]).should.be.true
    playStub.called.should.be.true

    queueStub.restore()
    goStub.restore()
    playStub.restore()
  })

  it('selects all songs', () => {
    const wrapper = mount(Component, { propsData: {
      items: songs,
      type: 'playlist'
    }})
    wrapper.find('.song-list-wrap').trigger('keydown.a', { ctrlKey: true })
    wrapper.vm.filteredItems.forEach(item => item.selected.should.be.true)
  })
})
