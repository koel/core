import Component from '@/components/utils/event-listeners.vue'
import factory from '@/tests/factory'
import { playlistStore, userStore } from '@/stores'
import router from '@/router'
import { ls } from '@/services'
import { alerts, event } from '@/utils'
import { mock } from '@/tests/__helpers__'

describe('utils/event-listeners', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('confirms a playlist deleting if the playlist is not empty', () => {
    mount(Component)

    const confirmMock = mock(alerts, 'confirm')
    event.emit(event.$names.PLAYLIST_DELETE, factory('playlist', {
      name: 'Foo',
      populated: true,
      songs: factory('song', 3)
    }))

    expect(confirmMock).toHaveBeenCalledWith(`Delete the playlist &quot;Foo&quot?`, expect.any(Function))
  })

  it("doesn't confirm deleting a playlist if the playlist is empty", () => {
    const playlist = factory('playlist', {
      populated: true,
      songs: []
    })

    mount(Component)
    const confirmMock = mock(alerts, 'confirm')
    const deleteMock = mock(playlistStore, 'delete')
    event.emit(event.$names.PLAYLIST_DELETE, playlist)

    expect(confirmMock).not.toHaveBeenCalled()
    expect(deleteMock).toHaveBeenCalledWith(playlist)
  })

  it('listens to log out event', () => {
    const wrapper = mount(Component)
    const lsRemoveMock = mock(ls, 'remove')
    const logOutMock = mock(userStore, 'logout')

    event.emit(event.$names.LOG_OUT)

    wrapper.vm.$nextTick(() => {
      expect(lsRemoveMock).toHaveBeenCalledWith('jwt-token')
      expect(logOutMock).toHaveBeenCalled()
    })
  })

  it('listen to koel-ready event', () => {
    mount(Component)
    const initRouterMock = mock(router, 'init')
    event.emit(event.$names.KOEL_READY)
    expect(initRouterMock).toHaveBeenCalled()
  })
})
