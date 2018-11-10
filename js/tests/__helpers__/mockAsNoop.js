import { noop } from '.'

export const mockAsNoop = (module, method) => {
  const mock = jest.spyOn(module, method)
  mock.mockImplementation(noop)
  return mock
}
