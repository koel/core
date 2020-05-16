import { secondsToHis, parseValidationError } from '@/utils'

describe('services/utils', () => {
  describe('#secondsToHis', () => {
    it('formats a duration to H:i:s', () => {
      expect(secondsToHis(7547)).toBe('02:05:47')
    })

    it('ommits hours from short duration when formats to H:i:s', () => {
      expect(secondsToHis(314)).toBe('05:14')
    })
  })

  describe('#parseValidationError', () => {
    it('parses single-level validation error', () => {
      const error = {
        err_1: ['Foo']
      }

      expect(parseValidationError(error)).toEqual(['Foo'])
    })

    it('parses multi-level validation error', () => {
      const error = {
        err_1: ['Foo', 'Bar'],
        err_2: ['Baz', 'Qux']
      }

      expect(parseValidationError(error)).toEqual(['Foo', 'Bar', 'Baz', 'Qux'])
    })
  })
})
