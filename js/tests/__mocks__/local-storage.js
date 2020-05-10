import { noop } from '@/utils'

module.exports = {
  get: jest.fn(noop),
  set: jest.fn(noop),
  remove: jest.fn(noop)
}
