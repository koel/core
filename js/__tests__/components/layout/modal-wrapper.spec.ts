import each from 'jest-each'
import Component from '@/components/layout/modal-wrapper.vue'
import { eventBus } from '@/utils'
import factory from '@/__tests__/factory'
import { shallow } from '@/__tests__/adapter'
import { mock } from '@/__tests__/__helpers__'
import { http } from '@/services'

describe('components/layout/modal-wrapper', () => {
  each([
    ['add-user-form', 'MODAL_SHOW_ADD_USER_FORM', undefined],
    ['edit-user-form', 'MODAL_SHOW_EDIT_USER_FORM', factory('user')],
    ['edit-song-form', 'MODAL_SHOW_EDIT_SONG_FORM', factory('song')],
    ['create-smart-playlist-form', 'MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM', undefined]
  ]).test('shows %s modal', async (
    modalName: string,
    eventName: string,
    eventParams?: any
  ) => {
    mock(http, 'request')
    const wrapper = shallow(Component, {
      stubs: [modalName]
    })
    eventBus.emit(eventName, eventParams)

    await wrapper.vm.$nextTick()
    expect(wrapper.has(`${modalName}-stub`)).toBe(true)
  })

  it('closes', async () => {
    const wrapper = shallow(Component, {
      stubs: ['add-user-form']
    })
    eventBus.emit('MODAL_SHOW_ADD_USER_FORM')
    await wrapper.vm.$nextTick()
    expect(wrapper.has('add-user-form-stub')).toBe(true)
    // @ts-ignore
    wrapper.vm.close()
    expect(wrapper.has('add-user-form-stub')).toBe(false)
  })
})
