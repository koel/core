import Component from '@/components/ui/volume.vue'
import { playback, socket } from '@/services'

describe('components/ui/volume', () => {
  it('renders properly', () => {
    const wrapper = shallow(Component)
    wrapper.hasAll('i.mute', '#volumeRange').should.be.true
  })

  it('mutes', () => {
    const muteStub = stub(playback, 'mute')
    shallow(Component).click('i.mute')
    muteStub.called.should.be.true
    muteStub.restore()
  })

  it('unmutes', () => {
    const unmuteStub = stub(playback, 'unmute')
    shallow(Component, {
      data: () => ({
        muted: true
      })
    }).click('i.unmute')
    unmuteStub.called.should.be.true
    unmuteStub.restore()
  })

  it('sets the volume', () => {
    const setVolumeStub = stub(playback, 'setVolume')
    shallow(Component).find('#volumeRange').setValue(4.2).input()
    setVolumeStub.calledWith(4.2).should.be.true
    setVolumeStub.restore()
  })

  it('broadcasts the volume value', () => {
    const broadcastStub = stub(socket, 'broadcast')
    shallow(Component).find('#volumeRange').setValue(4.2).change()
    broadcastStub.calledWith('SOCKET_VOLUME_CHANGED', 4.2).should.be.true
    broadcastStub.restore()
  })
})

