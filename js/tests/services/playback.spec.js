import each from 'jest-each'
import { playback } from '@/services'
import plyr from 'plyr'
import { mock } from '@/tests/__helpers__'
import {
  queueStore,
  sharedStore,
  userStore,
  songStore,
  recentlyPlayedStore,
  preferenceStore as preferences
} from '@/stores'
import factory from '@/tests/factory'

const prepareForTests = () => {
  document.body.innerHTML = `
  <div class="plyr">
    <audio crossorigin="anonymous" controls></audio>
  </div>
  <input
    class="plyr__volume"
    id="volumeRange"
    max="10"
    step="0.1"
    title="Volume"
    type="range"
  >
  `
  window.AudioContext = jest.fn().mockImplementation(() => {
    return {
      createMediaElementSource: jest.fn(() => {})
    }
  })

  // pretty ugly hack to make lodash's throttle play nice with jest
  playback.timeupdateThrottle = 0
}

describe('services/playback', () => {
  beforeEach(() => prepareForTests())

  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  it('only initializes once', () => {
    const plyrSetupSpy = jest.spyOn(plyr, 'setup')
    playback.init()
    expect(plyrSetupSpy).toHaveBeenCalled()
    playback.init()
    expect(plyrSetupSpy).toHaveBeenCalledTimes(1)
  })

  describe('listens to media events', () => {
    const playRegisterData = [
      /* playCountRegistered, isTranscoding, current media time, media duration, number of registerPlay()'s calls */
      [false, false, 100, 400, 1],
      [true, false, 100, 400, 0],
      [false, true, 100, 400, 0],
      [false, false, 100, 500, 0]
    ]
    each(playRegisterData).test(
      'when playCountRegistered is %s, isTranscoding is %s, current media time is %d, media duration is %d, then registerPlay() should be call %d times',
      (playCountRegistered, isTranscoding, currentTime, duration, numberOfCalls) => {
        queueStore.current = factory('song', { playCountRegistered })
        playback.init()
        playback.isTranscoding = isTranscoding
        const mediaElement = playback.player.media
        // we can't set mediaElement.currentTime|duration directly because they're read-only
        Object.defineProperties(mediaElement, {
          currentTime: {
            value: currentTime,
            configurable: true
          },
          duration: {
            value: duration,
            configurable: true
          }
        })

        const registerPlayMock = mock(playback, 'registerPlay')
        mediaElement.dispatchEvent(new Event('timeupdate'))
        expect(registerPlayMock).toHaveBeenCalledTimes(numberOfCalls)
      })

    it('plays next song if current song is errored', () => {
      playback.init()
      const playNextMock = mock(playback, 'playNext')
      playback.player.media.dispatchEvent(new Event('error'))
      expect(playNextMock).toHaveBeenCalled()
    })

    it('scrobbles if current song ends', () => {
      queueStore.current = factory('song')
      sharedStore.state.useLastfm = true
      userStore.current = factory('user', {
        preferences: {
          lastfm_session_key: 'foo'
        }
      })

      playback.init()
      const scrobbleMock = mock(songStore, 'scrobble')
      playback.player.media.dispatchEvent(new Event('ended'))
      expect(scrobbleMock).toHaveBeenCalled()
    })

    each([['REPEAT_ONE', 1, 0], ['NO_REPEAT', 0, 1], ['REPEAT_ALL', 0, 1]]).test(
      'when song ends, if repeat mode is %s then restart() is called %d times and playNext() is called %d times',
      (repeatMode, restartCalls, playNextCalls) => {
        sharedStore.state.useLastfm = false // so that no scrobbling is made unnecessarily
        preferences.repeatMode = repeatMode
        playback.init()
        const restartMock = mock(playback, 'restart')
        const playNextMock = mock(playback, 'playNext')
        playback.player.media.dispatchEvent(new Event('ended'))
        expect(restartMock).toHaveBeenCalledTimes(restartCalls)
        expect(playNextMock).toHaveBeenCalledTimes(playNextCalls)
      })

    const preloadData = [
      [false, true, 300, 310, 0],
      [true, false, 300, 310, 0],
      [false, false, 300, 400, 0],
      [false, false, 300, 310, 1]
    ]
    each(preloadData).test(
      'when next song preloaded is %s, isTrancoding is %s, current media time is %d, media duration is %d, then preload() should be called %d times',
      (preloaded, isTranscoding, currentTime, duration, numberOfCalls) => {
        queueStore.current = factory('song', { playCountRegistered: true }) // avoid triggering play count logic
        Object.defineProperty(queueStore, 'next', {
          get: () => factory('song', { preloaded })
        })
        playback.init()
        playback.isTranscoding = isTranscoding
        const mediaElement = playback.player.media
        Object.defineProperties(mediaElement, {
          currentTime: {
            value: currentTime,
            configurable: true
          },
          duration: {
            value: duration,
            configurable: true
          }
        })

        const preloadMock = mock(playback, 'preload')
        mediaElement.dispatchEvent(new Event('timeupdate'))
        expect(preloadMock).toHaveBeenCalledTimes(numberOfCalls)
      }
    )
  })

  it('registers play', () => {
    const recentlyPlayedStoreAddMock = mock(recentlyPlayedStore, 'add')
    const recentlyPlayedStoreFetchAllMock = mock(recentlyPlayedStore, 'fetchAll')
    const registerPlayMock = mock(songStore, 'registerPlay')
    const song = factory('song')
    playback.registerPlay(song)
    expect(recentlyPlayedStoreAddMock).toHaveBeenCalledWith(song)
    expect(recentlyPlayedStoreFetchAllMock).toHaveBeenCalled()
    expect(registerPlayMock).toHaveBeenCalledWith(song)
    expect(song.playCountRegistered).toBe(true)
  })
})
