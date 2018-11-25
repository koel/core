import each from 'jest-each'
import Component from '@/components/layout/modal-wrapper'
import AddUserForm from '@/components/user/add-form'
import EditUserForm from '@/components/user/edit-form'
import EditSongForm from '@/components/song/edit-form'
import CreateSmartPlaylistForm from '@/components/playlist/smart-playlist/create-form'
import { event } from '@/utils'
import factory from '@/tests/factory'

describe('components/layout/modal-wrapper', () => {
  each([
    ['AddUserForm', AddUserForm, ['MODAL_SHOW_ADD_USER_FORM']],
    ['EditUserForm', EditUserForm, ['MODAL_SHOW_EDIT_USER_FORM', factory('user')]],
    ['EditSongForm', EditSongForm, ['MODAL_SHOW_EDIT_SONG_FORM', factory('song')]],
    ['CreateSmartPlaylistForm', CreateSmartPlaylistForm, ['MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM']]
  ]).test('shows %s modal', async (modalName, modalComponent, eventParams, done) => {
    const wrapper = await mount(Component)
    await event.emit(...eventParams)

    wrapper.vm.$nextTick(() => {
      expect(wrapper.has(modalComponent)).toBe(true)
      done()
    })
  })

  it('closes', async done => {
    const wrapper = await mount(Component)
    await event.emit('MODAL_SHOW_ADD_USER_FORM')
    wrapper.vm.$nextTick(() => {
      wrapper.vm.close()
      expect(wrapper.has(AddUserForm)).toBe(false)
      done()
    })
  })
})
