import each from 'jest-each'
import Component from '@/components/layout/modal-wrapper.vue'
import AddUserForm from '@/components/user/add-form.vue'
import EditUserForm from '@/components/user/edit-form.vue'
import EditSongForm from '@/components/song/edit-form.vue'
import CreateSmartPlaylistForm from '@/components/playlist/smart-playlist/create-form.vue'
import { event } from '@/utils'
import factory from '@/tests/factory'
import { mount } from '@/tests/adapter'

describe('components/layout/modal-wrapper', () => {
  each([
    ['AddUserForm', AddUserForm, ['MODAL_SHOW_ADD_USER_FORM']],
    ['EditUserForm', EditUserForm, ['MODAL_SHOW_EDIT_USER_FORM', factory('user')]],
    ['EditSongForm', EditSongForm, ['MODAL_SHOW_EDIT_SONG_FORM', factory('song')]],
    ['CreateSmartPlaylistForm', CreateSmartPlaylistForm, ['MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM']]
  ]).test('shows %s modal', async (modalName, modalComponent, eventParams) => {
    const wrapper = mount(Component)
    event.emit(...eventParams)

    await wrapper.vm.$nextTick()
    expect(wrapper.has(modalComponent)).toBe(true)
  })

  it('closes', async () => {
    const wrapper = mount(Component)
    event.emit('MODAL_SHOW_ADD_USER_FORM')
    await wrapper.vm.$nextTick()
    // @ts-ignore
    wrapper.vm.close()
    expect(wrapper.has(AddUserForm)).toBe(false)
  })
})
