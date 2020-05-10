import each from 'jest-each'
import factory from '@/tests/factory'
import { albumStore } from '@/stores/album'
import Component from '@/components/ui/album-art-overlay'

describe('components/ui/album-art-overlay', () => {
  const cases = [
    ['no song playing', null],
    ['album having a cover same as stub', factory('album', {
      cover: albumStore.stub.cover
    })],
    ['album having a real cover', factory('album', {
      cover: '/img/foo.jpg'
    })]
  ]

  each(cases).test('matches what we expect with %s', (description, album) => {
    const wrapper = mount(Component, { propsData: { album } })
    expect(wrapper).toMatchSnapshot()
  })
})
