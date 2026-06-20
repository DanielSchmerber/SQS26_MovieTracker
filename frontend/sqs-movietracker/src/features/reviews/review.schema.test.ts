import { describe, expect, it } from 'vitest'

import { reviewSchema, reviewUpdateSchema } from './review.schema'

describe('review schemas', () => {
  it('accepts a complete review', () => {
    const result = reviewSchema.safeParse({
      movie_id: 42,
      rating: 8,
      comment: 'A thoughtful review.',
    })

    expect(result.success).toBe(true)
  })

  it('allows an empty optional comment', () => {
    const result = reviewSchema.safeParse({
      movie_id: 42,
      rating: 8,
      comment: '',
    })

    expect(result.success).toBe(true)
  })

  it('rejects ratings outside the supported range', () => {
    const result = reviewSchema.safeParse({
      movie_id: 42,
      rating: 11,
      comment: 'Too much enthusiasm.',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['rating'])
  })

  it('requires at least one field for review updates', () => {
    const result = reviewUpdateSchema.safeParse({})

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'Provide at least a rating or a comment to update',
    )
  })
})
