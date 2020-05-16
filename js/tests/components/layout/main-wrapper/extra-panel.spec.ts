import each from 'jest-each'
import Component from '@/components/layout/main-wrapper/extra-panel.vue'
import factory from '@/tests/factory'
import { event } from '@/utils'
import { songInfo } from '@/services'
import { mock } from '@/tests/__helpers__'
import { shallow, Wrapper } from '@/tests/adapter'

const shallowComponent = (data: object = {}): Wrapper => shallow(Component, {
  stubs: ['lyrics-pane', 'artist-info', 'album-info', 'you-tube-video-list'],
  data: () => data
})

describe('components/layout/extra-panel', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    expect(shallowComponent()).toMatchSnapshot()
  })

  it('does not have a YouTube tab if not using YouTube', async () => {
    const wrapper = shallowComponent({
      sharedState: {
        useYouTube: false
      }
    })
    await wrapper.vm.$nextTick()
    expect(shallow(Component)).toMatchSnapshot()
  })

  it('has a YouTube tab if using YouTube', async () => {
    const wrapper = shallowComponent({
      sharedState: {
        useYouTube: true
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.has('you-tube-video-list-stub')).toBe(true)
  })

  each([['#extraTabLyrics'], ['#extraTabAlbum'], ['#extraTabArtist']])
    .test('switches to "%s" tab', selector => {
      expect(shallowComponent().click(selector).find('[aria-selected=true]').is(selector)).toBe(true)
    })

  it('fetch song info when a new song is played', () => {
    shallowComponent()
    const song = factory('song')
    const m = mock(songInfo, 'fetch', song)
    event.emit('SONG_PLAYED', song)
    expect(m).toHaveBeenCalledWith(song)
  })
})
