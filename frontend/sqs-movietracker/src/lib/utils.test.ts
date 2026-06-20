import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('merges class names while ignoring empty values', () => {
    expect(cn('base', undefined, null, ['rounded', 'px-2'])).toBe(
      'base rounded px-2',
    )
  })

  it('resolves conflicting tailwind classes with the later value', () => {
    expect(cn('px-2 text-sm', 'px-4')).toBe('text-sm px-4')
  })
})
