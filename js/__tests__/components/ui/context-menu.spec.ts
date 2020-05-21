import Component from '@/components/ui/context-menu.vue'
import { eventBus } from '@/utils'
import { mock } from '@/__tests__/__helpers__'
import { mount } from '@/__tests__/adapter'

declare const global: any

describe('components/ui/context-menu', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('renders', () => {
    expect(mount(Component)).toMatchSnapshot()
  })

  it('renders extra CSS classes', () => {
    const wrapper = mount(Component, {
      propsData: {
        extraClass: 'foo'
      }
    })
    expect(wrapper.find('.menu').hasClass('foo')).toBe(true)
  })

  it('opens', () => {
    const wrapper = mount(Component)
    // @ts-ignore
    wrapper.vm.open(42, 128)
    expect(wrapper.find('.menu').element.style.top).toBe('42px')
    expect(wrapper.find('.menu').element.style.left).toBe('128px')
    expect(global.getComputedStyle(wrapper.find('.menu').element).display).toBe('block')
  })

  it('closes', () => {
    const wrapper = mount(Component)
    // @ts-ignore
    wrapper.vm.open(42, 128)
    // @ts-ignore
    wrapper.vm.close()
    expect(global.getComputedStyle(wrapper.find('.menu').element).display).toBe('none')
  })

  it('notifies other instances to close', () => {
    const m = mock(eventBus, 'emit')
    const wrapper = mount(Component)
    // @ts-ignore
    wrapper.vm.open(42, 128)
    expect(m).toHaveBeenCalledWith('CONTEXT_MENU_OPENING')
  })
})
