import { describe, expect, it } from 'vitest'
import { loginSchema } from '@/lib/validation/login'

describe('login — validación Zod (REQ-FUNC-002)', () => {
  it('acepta email y password válidos', () => {
    const result = loginSchema.safeParse({
      email: 'alumno@xclusive.app',
      password: 'secret123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('alumno@xclusive.app')
      expect(result.data.password).toBe('secret123')
    }
  })

  it('rechaza email inválido sin invocar Supabase Auth', () => {
    const result = loginSchema.safeParse({
      email: 'no-es-un-email',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('email')
    }
  })

  it('rechaza password menor a 6 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'alumno@xclusive.app',
      password: '123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('password')
    }
  })

  it('rechaza campos ausentes o vacíos', () => {
    expect(loginSchema.safeParse({}).success).toBe(false)
    expect(loginSchema.safeParse({ email: '', password: '' }).success).toBe(false)
    expect(
      loginSchema.safeParse({ email: 'alumno@xclusive.app', password: undefined }).success,
    ).toBe(false)
  })

  it('rechaza tipos no string (ej. números)', () => {
    expect(
      loginSchema.safeParse({ email: 123, password: 'secret123' }).success,
    ).toBe(false)
  })
})