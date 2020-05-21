import Component from '@/components/playlist/sidebar-item.vue'
import NameEditor from '@/components/playlist/name-editor.vue'
import factory from '@/__tests__/factory'
import { shallow, mount } from '@/__tests__/adapter'

describe('components/playlist/sidebar-item', () => {
  let playlist: Playlist
  beforeEach(() => {
    playlist = factory<Playlist>('playlist', {
      id: 99,
      name: 'Foo'
    })
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('renders a playlist menu item', () => {
    const wrapper = shallow(Component, {
      propsData: { playlist }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the Favorites menu item', () => {
    const wrapper = shallow(Component, {
      propsData: {
        playlist: {
          name: 'Favorites'
        },
        type: 'favorites'
      }
    })
    expect(wrapper.find('li.playlist.favorites').text()).toMatch('Favorites')
  })

  // skipping because buggy test utils
  it.skip('edits a playlist', async () => {
    const wrapper = mount(Component, {
      propsData: { playlist }
    })

    wrapper.dblclick('li.playlist:last-of-type:not(.favorites):not(.recently-played)')
    await wrapper.vm.$nextTick()
    expect(wrapper.has(NameEditor)).toBe(true)
  })

  // skipping because buggy test utils
  it.skip("doesn't allow editing Favorites item", async () => {
    const wrapper = shallow(Component, {
      propsData: {
        playlist: { name: 'Favorites' },
        type: 'favorites'
      }
    })

    wrapper.dblclick('li.favorites')
    await wrapper.vm.$nextTick()
    expect(wrapper.has(NameEditor)).toBe(false)
  })
})
