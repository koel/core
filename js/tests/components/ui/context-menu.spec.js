import Component from '@/components/ui/context-menu'
import { event } from '@/utils'
import { mock } from '@/tests/__helpers__'

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
    wrapper.vm.open(42, 128)
    expect(wrapper.find('.menu').element.style.top).toBe('42px')
    expect(wrapper.find('.menu').element.style.left).toBe('128px')
    expect(getComputedStyle(wrapper.find('.menu').element).display).toBe('block')
  })

  it('closes', () => {
    const wrapper = mount(Component)
    wrapper.vm.open(42, 128)
    wrapper.vm.close()
    expect(getComputedStyle(wrapper.find('.menu').element).display).toBe('none')
  })

  it('notifies other instances to close', () => {
    const m = mock(event, 'emit')
    const wrapper = mount(Component)
    wrapper.vm.open(42, 128)
    expect(m).toHaveBeenCalledWith('CONTEXT_MENU_OPENING')
  })
})
