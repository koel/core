import { noop } from '@/utils'

export const mock = (module: any, method: string, implementation: any = noop) => {
  const m = jest.spyOn(module, method)

  if (!(implementation instanceof Function)) {
    m.mockImplementation((): any => implementation)
  } else {
    m.mockImplementation(implementation)
  }

  return m
}
