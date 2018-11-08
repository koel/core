import Component from '@/components/song/track-list-item.vue'
import { sharedStore, songStore, queueStore } from '@/stores'
import { playback, ls } from '@/services'
import factory from '@/tests/factory'

describe('componnents/song/track-list-item', () => {
  let song, guessStub, lsGetStub
  const track = {
    title: 'Foo and bar',
    fmtLenth: '00:42'
  }
  const album = factory('album', { id: 42 })
  window.BASE_URL = 'http://koel.local/'

  beforeEach(() => {
    sharedStore.state.useiTunes = true
    song = factory('song')
    guessStub = stub(songStore, 'guess').callsFake(() => song)
    lsGetStub = stub(ls, 'get').callsFake(() => 'abcdef')
  })

  afterEach(() => {
    guessStub.restore()
    lsGetStub.restore()
  })

  it('renders', () => {
    const wrapper = shallow(Component, { propsData: {
      track,
      album,
      index: 1
    }})
    wrapper.find('li.available').should.be.ok
    wrapper.html().should.contain('Foo and bar')
  })

  it('has an iTunes link if there is no such local song', () => {
    guessStub.callsFake(() => false)
    shallow(Component, { propsData: {
      track,
      album,
      index: 1
    }}).html().should.contain('http://koel.local/api/itunes/song/42?q=Foo%20and%20bar&amp;jwt-token=abcdef')
  })

  it('plays', () => {
    const containsStub = stub(queueStore, 'contains').callsFake(() => false)
    const queueStub = stub(queueStore, 'queueAfterCurrent')
    const playStub = stub(playback, 'play')

    shallow(Component, { propsData: {
      track,
      album,
      index: 1
    }}).click('li')

    containsStub.calledWith(song).should.be.true
    queueStub.calledWith(song).should.be.true
    playStub.calledWith(song).should.be.true

    containsStub.restore()
    queueStub.restore()
    playStub.restore()
  })
})
