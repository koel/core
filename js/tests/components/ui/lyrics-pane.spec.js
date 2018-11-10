import Lyrics from '@/components/ui/lyrics-pane.vue'
import factory from '@/tests/factory'

describe('components/ui/lyrics', () => {
  it('displays lyrics if the song has lyrics', () => {
    const song = factory('song')
    expect(shallow(Lyrics, {
      propsData: { song }
    }).html()).toMatch(song.lyrics)
  })

  it('displays a fallback message if the song has no lyrics', () => {
    expect(shallow(Lyrics, {
      propsData: {
        song: factory('song', { lyrics: '' })
      }
    }).html()).toMatch('No lyrics found. Are you not listening to Bach?')
  })
})
