import Lyrics from '@/components/ui/lyrics-pane.vue'
import factory from '@/tests/factory'
import { shallow } from '@/tests/adapter'

describe('components/ui/lyrics', () => {
  it('displays lyrics if the song has lyrics', () => {
    expect(shallow(Lyrics, {
      propsData: {
        song: factory('song', { lyrics: 'Foo and bar' })
      }
    })).toMatchSnapshot()
  })

  it('displays a fallback message if the song has no lyrics', () => {
    expect(shallow(Lyrics, {
      propsData: {
        song: factory('song', { lyrics: '' })
      }
    })).toMatchSnapshot()
  })
})
