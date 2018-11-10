import { noop } from '.'

export const mock = (module, method, implementation = noop) => {
  const m = jest.spyOn(module, method)

  if (typeof implementation !== 'function') {
    m.mockImplementation(() => implementation)
  } else {
    m.mockImplementation(implementation)
  }

  return m
}
