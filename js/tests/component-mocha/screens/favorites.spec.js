import Component from '@/components/screens/favorites.vue'
import SongList from '@/components/song/list.vue'
import SongListControls from '@/components/song/list-controls.vue'
import { download } from '@/services'
import factory from '@/tests/factory'

describe('components/screens/favorites', () => {
  it('displays the song list if there are favorites', async done => {
    const wrapper = await shallow(Component, {
      data: () => ({
        state: {
          songs: factory('song', 5)
        }
      })
    })

    Vue.nextTick(() => {
      wrapper.hasAll(SongList, SongListControls).should.be.true
      wrapper.findAll('div.none').should.have.lengthOf(0)
      done()
    })
  })

  it('displays a fallback message if there are no favorites', () => {
    const wrapper = shallow(Component, {
      data: () => ({
        state: {
          songs: []
        }
      })
    })

    wrapper.findAll('div.none').should.have.lengthOf(1)
  })

  it('allows downloading', () => {
    const downloadStub = stub(download, 'fromFavorites')

    const wrapper = shallow(Component, {
      data: () => ({
        state: {
          songs: factory('song', 5)
        },
        sharedState: { allowDownload: true }
      })
    })

    wrapper.click('a.download')
    downloadStub.called.should.be.true
    downloadStub.restore()
  })
})
