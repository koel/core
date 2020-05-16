import Component from '@/components/screens/all-songs.vue'
import SongList from '@/components/song/list.vue'
import factory from '@/tests/factory'
import { songStore } from '@/stores'
import { mount } from '@/tests/adapter'

describe('components/screens/all-songs', () => {
  it('renders properly', async () => {
    songStore.all = factory<Song>('song', 10)
    const wrapper = mount(Component)

    await wrapper.vm.$nextTick()
    expect(wrapper.find('h1.heading').text()).toMatch('All Songs')
    expect(wrapper.has(SongList)).toBe(true)
  })
})
