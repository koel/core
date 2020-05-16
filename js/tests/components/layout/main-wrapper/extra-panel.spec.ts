import each from 'jest-each'
import Component from '@/components/layout/main-wrapper/extra-panel.vue'
import factory from '@/tests/factory'
import { event } from '@/utils'
import { songInfo } from '@/services'
import { mock } from '@/tests/__helpers__'
import { shallow } from '@/tests/adapter'

describe('components/layout/extra-panel', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })

  it('does not have a YouTube tab if not using YouTube', async () => {
    const wrapper = shallow(Component, {
      data: () => ({
        sharedState: {
          useYouTube: false
        }
      })
    })
    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })

  it('has a YouTube tab if using YouTube', async () => {
    const wrapper = shallow(Component, {
      data: () => ({
        sharedState: {
          useYouTube: true
        }
      })
    })

    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })

  each([['#extraTabLyrics'], ['#extraTabAlbum'], ['#extraTabArtist']])
    .test('switches to "%s" tab', selector => {
      const wrapper = shallow(Component)
      wrapper.click(selector)
      expect(wrapper.find('[aria-selected=true]').is(selector)).toBe(true)
    })

  it('fetch song info when a new song is played', () => {
    shallow(Component)
    const song = factory('song')
    const m = mock(songInfo, 'fetch', song)
    event.emit('SONG_PLAYED', song)
    expect(m).toHaveBeenCalledWith(song)
  })
})
