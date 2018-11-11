import localStorage from 'local-storage'
import { ls } from '@/services'

describe('services/ls', () => {
  beforeEach(() => localStorage.remove('foo'))

  it('gets an existing item from local storage', () => {
    localStorage('foo', 'bar')
    expect(ls.get('foo')).toBe('bar')
  })

  it('returns the default value for a non exising item', () => {
    expect(ls.get('baz', 'qux')).toBe('qux')
  })

  it('sets an item into local storage', () => {
    ls.set('foo', 'bar')
    expect(localStorage('foo')).toBe('bar')
  })

  it('correctly removes an item from local storage', () => {
    localStorage('foo', 'bar')
    ls.remove('foo')
    expect(localStorage('foo')).toBeNull()
  })
})
