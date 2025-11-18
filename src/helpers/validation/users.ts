import type { ValidationError } from '@/models/global'

function validateUsername(input: string): ValidationError {
  const username = input.trim()
  const errors: string[] = []
  const invalidChars = /[!@#$%^&*()_+\-={}\[\]:";'<>.,?\/]/

  if (username.match(invalidChars)) errors.push('Username contains invalid characters.')

  if (username.length < 3 || username.length > 20)
    errors.push('Username must be between 3 and 20 characters long.')

  return {
    field: 'username',
    errors: errors,
  } as ValidationError
}

function validatePassword(input: string): ValidationError {
  const password = input.trim()
  const errors: string[] = []
  const oneUpperCase = /[A-Z]/
  const oneDigit = /[0-9]/
  const oneSpecialChar = /[!@#$%^&*()_+~`\-=]/

  if (password.length < 6) errors.push('Password must be at least 6 characters long.')

  if (!password.match(oneUpperCase))
    errors.push('Password must contain at least one uppercase letter.')

  if (!password.match(oneDigit)) errors.push('Password must contain at least one digit.')

  if (!password.match(oneSpecialChar))
    errors.push('Password must contain at least one special character.')

  return {
    field: 'password',
    errors: errors,
  } as ValidationError
}

export { validatePassword, validateUsername }
