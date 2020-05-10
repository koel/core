import Vue from 'vue'
import { Wrapper as BaseWrapper, VueClass } from '@vue/test-utils/types/index'
import { mount as baseMount, shallowMount, MountOptions } from '@vue/test-utils'

interface Wrapper extends BaseWrapper<Vue> {
  readonly vm: Vue
  has(what: any): boolean
  html(): string
  text(): string
  click(selector: string): Wrapper
  change(selector: string): Wrapper
  dblclick(selector: string): Wrapper
  submit (selector: string): Wrapper
  find(any: any): Wrapper
  setValue(value: string): Wrapper
  input(): Wrapper
  blur(): Wrapper
  hasAll(...args: any): Wrapper
}

export const mount = (component: VueClass<Vue>, options: MountOptions<Vue> = {}): Wrapper => {
  return baseMount(component, options) as Wrapper
}

export const shallow = (component: VueClass<Vue>, options: MountOptions<Vue> = {}): Wrapper => {
  return shallowMount(component, options) as Wrapper
}
