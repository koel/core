import each from 'jest-each'
import Component from '@/components/song/list-controls'
import factory from '@/tests/factory'
import { take } from 'lodash'

describe('components/song/list-controls', () => {
  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })

  each([[factory('song', 5), 0], [factory('song', 5), 1]]).test(
    'allows shuffling all if less than 2 songs are selected',
    async (songs, selectedSongCount, done) => {
      const selectedSongs = take(songs, selectedSongCount)
      const wrapper = await mount(Component, { propsData: { songs, selectedSongs }})

      wrapper.vm.$nextTick(() => {
        expect(wrapper.click('.btn-shuffle-all').hasEmitted('playAll', true)).toBe(true)
        done()
      })
    })

  it('allows shuffling selected if more than 1 song are selected', () => {
    const songs = factory('song', 5)

    expect(shallow(Component, { propsData: {
      songs,
      selectedSongs: take(songs, 2)
    }}).click('.btn-shuffle-selected').hasEmitted('playSelected', true)).toBe(true)
  })

  it('displays the "Add To" menu', () => {
    const songs = factory('song', 5)

    expect(shallow(Component, { propsData: {
      songs,
      selectedSongs: take(songs, 2)
    }}).has('.btn-add-to')).toBe(true)
  })

  it('allows clearing queue', () => {
    expect(shallow(Component, {
      data: () => ({
        fullConfig: {
          clearQueue: true
        }
      })
    }).click('.btn-clear-queue').hasEmitted('clearQueue')).toBe(true)
  })

  it('allows deleting current playlist', () => {
    expect(shallow(Component, {
      data: () => ({
        fullConfig: {
          deletePlaylist: true
        }
      })
    }).click('.btn-delete-playlist').hasEmitted('deletePlaylist')).toBe(true)
  })
})
