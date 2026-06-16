import { describe, expect, it } from 'vitest'

import { loginSchema, registerSchema } from './auth.schemas'

describe('auth schemas', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      username: 'movieFan',
      password: 'supersecret',
    })

    expect(result.success).toBe(true)
  })

  it('rejects short usernames and passwords', () => {
    const result = loginSchema.safeParse({
      username: 'a',
      password: 'short',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual([
      'username',
      'password',
    ])
  })

  it('requires matching passwords when registering', () => {
    const result = registerSchema.safeParse({
      username: 'movieFan',
      email: 'fan@example.com',
      password: 'supersecret',
      confirmPassword: 'different',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword'])
  })
})
