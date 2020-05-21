import each from 'jest-each'
import Component from '@/components/ui/view-mode-switch.vue'
import { shallow } from '@/__tests__/adapter'

describe('components/ui/view-mode-switch', () => {
  it('renders properly', () => {
    expect(shallow(Component, {
      propsData: {
        value: 'thumbnails'
      }
    })).toMatchSnapshot()
  })

  each([['thumbnails'], ['list']]).test('emits the "%s" mode value', mode => {
    const wrapper = shallow(Component, {
      propsData: {
        value: 'list'
      }
    })
    expect(wrapper.input(`input[value=${mode}]`).hasEmitted('input', mode)).toBe(true)
  })
})
