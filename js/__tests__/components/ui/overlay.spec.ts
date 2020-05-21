import each from 'jest-each'
import Component from '@/components/ui/overlay.vue'
import { mount } from '@/__tests__/adapter'

describe('components/shared/overlay', () => {
  it('shows with default options', async () => {
    const wrapper = mount(Component)
    // @ts-ignore
    wrapper.vm.show()

    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })

  it('allows option overriding', async () => {
    const wrapper = mount(Component)
    // @ts-ignore
    wrapper.vm.show({
      dismissable: true,
      type: 'warning',
      message: 'Foo'
    })

    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })

  each([['show', true], ['hide', false]]).test('%ss', (methodName) => {
    const wrapper = mount(Component)
    // @ts-ignore
    wrapper.vm[methodName]()
    expect(wrapper).toMatchSnapshot()
  })

  it('dismisses', () => {
    const wrapper = mount(Component)
    // @ts-ignore
    wrapper.vm.show({ dismissable: true })
    expect(wrapper.has('.display')).toBe(true)
    wrapper.click('button.btn-dismiss')
    expect(wrapper.has('.display')).toBe(false)
  })
})
