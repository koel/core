import ExtraSidebar from '@/components/main-wrapper/extra/index.vue'
import ArtistInfo from '@/components/main-wrapper/extra/artist-info.vue'
import AlbumInfo from '@/components/main-wrapper/extra/album-info.vue'
import Lyrics from '@/components/main-wrapper/extra/lyrics.vue'
import YouTube from '@/components/main-wrapper/extra/youtube.vue'
import factory from '@/tests/factory'
import { event } from '@/utils'
import { songInfo } from '@/services'

describe('components/main-wrapper/extra/index', () => {
  it('shows by default', () => {
    shallow(ExtraSidebar).findAll('#extra.showing').should.have.lengthOf(1)
  })

  it('does not have a YouTube tab if not using YouTube', async (done) => {
    const wrapper = await mount(ExtraSidebar)
    wrapper.vm.$nextTick(() => {
      wrapper.findAll('.header .youtube').should.have.lengthOf(0)
      done()
    })
  })

  it('has a YouTube tab if using YouTube', async (done) => {
    const wrapper = await mount(ExtraSidebar, {
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
    const wrapper = shallow(ExtraSidebar)
    expect(wrapper.find('.header .active').is('.lyrics')).toBe(true)
    ;['.artist', '.album', '.lyrics'].forEach(selector => {
      wrapper.click(`.header ${selector}`)
      wrapper.find('.header .active').is(selector).should.be.true
    })
  })

  it('has proper child components', async (done) => {
    const wrapper = await mount(ExtraSidebar, {
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
    shallow(ExtraSidebar)
    const song = factory('song')
    const fetchSongInfoStub = sinon.stub(songInfo, 'fetch').callsFake(() => song)
    event.emit('SONG_PLAYED', song)

    fetchSongInfoStub.calledWith(song).should.be.true
    fetchSongInfoStub.restore()
  })
})
