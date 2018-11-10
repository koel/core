import Component from '@/components/playlist/item.vue'
import factory from '@/tests/factory'
import { playlistStore } from '@/stores'
import { mock } from '@/tests/__helpers__'

describe('component/playlist/item', () => {
  let playlist
  beforeEach(() => {
    playlist = factory('playlist', {
      id: 99,
      name: 'Foo'
    })
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
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

  it('edits a playlist', () => {
    const updateStub = mock(playlistStore, 'update')
    const wrapper = shallow(Component, {
      propsData: { playlist }
    })
    wrapper.dblclick('li.playlist')
    wrapper.blur('input[type=text]')
    expect(updateStub).toHaveBeenCalledWith(playlist)
  })

  it("doesn't allow editing Favorites item", () => {
    const wrapper = shallow(Component, {
      propsData: {
        playlist: { name: 'Favorites' },
        type: 'favorites'
      }
    })
    wrapper.dblclick('li.favorites')
    expect(wrapper.has('input[type=text]')).toBe(false)
  })
})
