import Component from '@/components/screens/queue.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { queueStore, songStore } from '@/stores'
import { playback } from '@/services'

describe.skip('components/screens/queue', () => {
  it('renders properly', async () => {
    const wrapper = await shallow(Component, {
      data: () => ({
        state: { songs: factory('song', 10) }
      })
    })

    Vue.nextTick(() => {
      wrapper.find('h1.heading').text().should.contain('Current Queue')
      wrapper.has(SongList).should.be.true
    })
  })

  it('prompts to shuffle all songs if there are songs and current queue is empty', () => {
    songStore.state.songs = factory('song', 10)
    shallow(Component, {
      data: () => ({
        state: { songs: [] }
      })
    }).find('a.start').text().should.contain('shuffling all songs')
  })

  it("doesn't prompt to shuffle all songs if there is no song", () => {
    songStore.state.songs = []
    shallow(Component, {
      data: () => ({
        state: {
          songs: []
        }
      })
    }).has('a.start').should.be.false
  })

  it('shuffles all songs in the queue if any', () => {
    const queueAndPlayStub = stub(playback, 'queueAndPlay')
    const songs = factory('song', 10)
    const wrapper = mount(Component, {
      data: () => ({
        state: { songs }
      })
    })

    wrapper.click('button.btn-shuffle-all')
    queueAndPlayStub.calledWith(songs).should.be.true
    queueAndPlayStub.restore()
  })

  it('shuffles all available songs if there are no songs queued', () => {
    const queueAndPlayStub = stub(playback, 'queueAndPlay')
    mount(Component, {
      data: () => ({
        state: {
          songs: []
        }
      })
    }).click('button.btn-shuffle-all')
    queueAndPlayStub.calledWith(songStore.all).should.be.true
    queueAndPlayStub.restore()
  })

  it('clears the queue', () => {
    const clearStub = stub(queueStore, 'clear')
    const wrapper = mount(Component, {
      data: () => ({
        state: { songs: factory('song', 10) }
      })
    })
    wrapper.click('button.btn-clear-queue')
    clearStub.called.should.be.true
    clearStub.restore()
  })
})
