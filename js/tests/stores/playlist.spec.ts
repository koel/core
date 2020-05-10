import factory from '@/tests/factory'
import { playlistStore } from '@/stores'

const ruleGroups = [
  {
    id: 1,
    rules: [
      {
        id: 1,
        model: {
          name: 'artist.name',
          type: 'text',
          label: 'Artist'
        },
        operator: 'is',
        value: 'Elvis Presley'
      }
    ]
  },
  {
    id: 2,
    rules: [
      {
        id: 1,
        model: {
          name: 'artist.name',
          type: 'text',
          label: 'Artist'
        },
        operator: 'is',
        value: 'Queen'
      }
    ]
  }
]

const serializedRuleGroups = [
  {
    id: 1,
    rules: [
      {
        id: 1,
        model: 'artist.name',
        operator: 'is',
        value: 'Elvis Presley'
      }
    ]
  },
  {
    id: 2,
    rules: [
      {
        id: 1,
        model: 'artist.name',
        operator: 'is',
        value: 'Queen'
      }
    ]
  }
]

describe('stores/playlist', () => {
  it('serializes playlist for storage', () => {
    expect(playlistStore.serializeSmartPlaylistRulesForStorage(ruleGroups)).toEqual(serializedRuleGroups)
  })

  it('set up a smart playlist with properly unserialized rules', () => {
    const playlist = factory('playlist', {
      is_smart: true,
      rules: serializedRuleGroups
    })

    playlistStore.setupSmartPlaylist(playlist)
    expect(playlist.rules).toEqual(ruleGroups)
  })
})
