import Albums from '@/components/main-wrapper/main-content/albums.vue'
import AlbumItem from '@/components/shared/album-item.vue'
import factory from '@/tests/factory'

describe('components/main-wrapper/main-content/albums', () => {
  it('displays a list of albums', async (done) => {
    const wrapper = await mount(Albums, {
      data: () => ({
        albums: factory('album', 5)
      })
    })

    Vue.nextTick(() => {
      wrapper.findAll(AlbumItem).should.have.lengthOf(5)
      done()
    })
  })
})
