import Component from '@/components/album/track-list.vue'
import TrackListItem from '@/components/album/track-list-item.vue'
import factory from '@/tests/factory'
import { mount } from '@/tests/adapter'

describe('components/album/track-list', () => {
  it('lists the correct number of tracks', async done => {
    const wrapper = mount(Component, {
      propsData: {
        album: factory('album')
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll(TrackListItem)).toHaveLength(2)
    done()
  })
})
