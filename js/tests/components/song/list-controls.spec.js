import each from 'jest-each'
import Component from '@/components/song/list-controls.vue'
import factory from '@/tests/factory'

describe('components/song/list-controls', () => {
  it('renders properly', () => {
    expect(shallow(Component)).toMatchSnapshot()
  })

  each([[[]], [[factory('song')]]]).test('allows shuffling all if less than 2 songs are selected', selectedSongs => {
    expect(
      shallow(Component, { propsData: { selectedSongs }})
        .click('.btn-shuffle-all')
        .hasEmitted('shuffleAll')
    ).toBe(true)
  })

  it('allows shuffling selected if more than 1 song are selected', () => {
    expect(shallow(Component, { propsData: {
      selectedSongs: factory('song', 3)
    }}).click('.btn-shuffle-selected').hasEmitted('shuffleSelected')).toBe(true)
  })

  it('displays the "Add To" menu', () => {
    expect(shallow(Component, { propsData: {
      selectedSongs: factory('song', 3)
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
