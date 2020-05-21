import { noop } from '@/utils'

export default {
  get: jest.fn(noop),
  set: jest.fn(noop),
  remove: jest.fn(noop)
}
