import Component from '@/components/ui/overlay.vue'
import SoundBar from '@/components/ui/sound-bar.vue'

describe('components/shared/overlay', () => {
  it('shows with default options', async done => {
    const wrapper = mount(Component)
    await wrapper.vm.show()

    Vue.nextTick(() => {
      expect(wrapper.has(SoundBar)).toBe(true)
      expect(wrapper.has('button.btn-dismiss')).toBe(false)
      done()
    })
  })

  it('allows option overriding', async done => {
    const wrapper = mount(Component)
    await wrapper.vm.show({
      dismissable: true,
      type: 'warning',
      message: 'Foo'
    })

    Vue.nextTick(() => {
      expect(wrapper.has(SoundBar)).toBe(false)
      expect(wrapper.has('button.btn-dismiss')).toBe(true)
      expect(wrapper.find('span.message').html()).toMatch('Foo')
      done()
    })
  })

  it('hides', () => {
    const wrapper = mount(Component)
    wrapper.vm.show()
    expect(wrapper.has('.display')).toBe(true)
    wrapper.vm.hide()
    expect(wrapper.has('.display')).toBe(false)
  })

  it('dismisses', () => {
    const wrapper = mount(Component)
    wrapper.vm.show({ dismissable: true })
    expect(wrapper.has('.display')).toBe(true)
    wrapper.click('button.btn-dismiss')
    expect(wrapper.has('.display')).toBe(false)
  })
})
