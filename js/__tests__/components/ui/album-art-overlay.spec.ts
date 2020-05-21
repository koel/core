import each from 'jest-each'
import factory from '@/__tests__/factory'
import { albumStore } from '@/stores/album'
import Component from '@/components/ui/album-art-overlay.vue'
import { mount } from '@/__tests__/adapter'

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

  each(cases).test('renders property with %s', (description, album) => {
    const wrapper = mount(Component, { propsData: { album } })
    expect(wrapper).toMatchSnapshot()
  })
})
