import Component from '@/components/layout/main-wrapper/main-content.vue'
import { event } from '@/utils'
import factory from '@/tests/factory'

describe('components/layout/main-wrapper/main-content', () => {
  it('has a translucent image per song/album', () => {
    const wrapper = shallow(Component)
    const song = factory('song', {
      album: factory('album', {
        cover: 'http://foo/bar.jpg'
      })
    })
    event.emit('SONG_PLAYED', song)
    expect(wrapper).toMatchSnapshot()
  })
})
