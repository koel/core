import Component from '@/components/ui/volume.vue'
import { playback, socket } from '@/services'
import { mockAsNoop } from '@/tests/__helpers__'

describe('components/ui/volume', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders properly', () => {
    const wrapper = shallow(Component)
    expect(wrapper.hasAll('i.mute', '#volumeRange')).toBe(true)
  })

  it('mutes', () => {
    const muteStub = mockAsNoop(playback, 'mute')
    shallow(Component).click('i.mute')
    expect(muteStub).toHaveBeenCalled()
  })

  it('unmutes', () => {
    const unmuteStub = mockAsNoop(playback, 'unmute')
    shallow(Component, {
      data: () => ({
        muted: true
      })
    }).click('i.unmute')
    expect(unmuteStub).toHaveBeenCalled()
  })

  it('sets the volume', () => {
    const setVolumeStub = mockAsNoop(playback, 'setVolume')
    shallow(Component).find('#volumeRange').setValue(4.2).input()
    expect(setVolumeStub).toHaveBeenCalledWith(4.2)
  })

  it('broadcasts the volume value', () => {
    const broadcastStub = mockAsNoop(socket, 'broadcast')
    shallow(Component).find('#volumeRange').setValue(4.2).change()
    expect(broadcastStub).toHaveBeenCalledWith('SOCKET_VOLUME_CHANGED', 4.2)
  })
})

