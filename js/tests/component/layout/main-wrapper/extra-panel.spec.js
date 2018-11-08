import Component from '@/components/layout/main-wrapper/extra-panel.vue'
import ArtistInfo from '@/components/artist/info.vue'
import AlbumInfo from '@/components/album/info.vue'
import Lyrics from '@/components/ui/lyrics-pane.vue'
import YouTube from '@/components/ui/youtube-video-list.vue'
import factory from '@/tests/factory'
import { event } from '@/utils'
import { songInfo } from '@/services'

describe('components/layout/extra-panel', () => {
  it('shows by default', () => {
    shallow(Component).findAll('#extra.showing').should.have.lengthOf(1)
  })

  it('does not have a YouTube tab if not using YouTube', async (done) => {
    const wrapper = await mount(Component)
    wrapper.vm.$nextTick(() => {
      wrapper.findAll('.header .youtube').should.have.lengthOf(0)
      done()
    })
  })

  it('has a YouTube tab if using YouTube', async (done) => {
    const wrapper = await mount(Component, {
      data: () => ({
        sharedState: { useYouTube: true }
      })
    })

    wrapper.vm.$nextTick(() => {
      wrapper.findAll('.header .youtube').should.have.lengthOf(1)
      wrapper.has(YouTube).should.be.true
      done()
    })
  })

  it('switches pane properly', () => {
    const wrapper = shallow(Component)
    expect(wrapper.find('.header .active').is('.lyrics')).toBe(true)
    ;['.artist', '.album', '.lyrics'].forEach(selector => {
      wrapper.click(`.header ${selector}`)
      wrapper.find('.header .active').is(selector).should.be.true
    })
  })

  it('has proper child components', async (done) => {
    const wrapper = await mount(Component, {
      data: () => ({
        song: factory('song'),
        sharedState: { useYouTube: true }
      })
    })

    wrapper.vm.$nextTick(() => {
      ;[ArtistInfo, AlbumInfo, Lyrics, YouTube].forEach(component => {
        wrapper.has(component).should.be.true
      })
      done()
    })
  })

  it('fetch song info when a new song is played', () => {
    shallow(Component)
    const song = factory('song')
    const fetchSongInfoStub = stub(songInfo, 'fetch').callsFake(() => song)
    event.emit('SONG_PLAYED', song)

    fetchSongInfoStub.calledWith(song).should.be.true
    fetchSongInfoStub.restore()
  })
})
