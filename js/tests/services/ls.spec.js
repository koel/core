import localStorage from 'local-storage'
import { ls } from '@/services'

describe('services/ls', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('gets an existing item from local storage', () => {
    localStorage.get.mockReturnValue('bar')
    const item = ls.get('foo')

    expect(localStorage.get).toHaveBeenCalledWith('foo')
    expect(item).toBe('bar')
  })

  it('returns the default value for a non exising item', () => {
    localStorage.get.mockReturnValue(null)
    const item = ls.get('foo', 42)

    expect(localStorage.get).toHaveBeenCalledWith('foo')
    expect(item).toBe(42)
  })

  it('sets an item into local storage', () => {
    ls.set('foo', 42)
    expect(localStorage.set).toHaveBeenCalledWith('foo', 42)
  })

  it('correctly removes an item from local storage', () => {
    ls.remove('foo')
    expect(localStorage.remove).toHaveBeenCalledWith('foo')
  })
})
