import Component from '@/components/playlist/sidebar-item'
import NameEditor from '@/components/playlist/name-editor'
import factory from '@/tests/factory'

describe('components/playlist/sidebar-item', () => {
  let playlist
  beforeEach(() => {
    playlist = factory('playlist', {
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
    expect(wrapper.find('a[href="#!/favorites"]').text()).toMatch('Favorites')
  })

  // skipping because buggy test utils
  it.skip('edits a playlist', async () => {
    const wrapper = mount(Component, {
      propsData: { playlist }
    })

    await wrapper.dblclick('li.playlist')
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

    await wrapper.dblclick('li.favorites')
    expect(wrapper.has(NameEditor)).toBe(false)
  })
})
