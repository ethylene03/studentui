import type { ValidationError } from '@/models/global'
import type { Student } from '@/models/students'

function validateAll(student: Student): ValidationError[] {
  const errors: ValidationError[] = []

  const firstNameErrors = validateName(student.firstName)
  if (firstNameErrors.errors.length > 0)
    errors.push({ field: 'firstName', errors: firstNameErrors.errors })

  const lastNameErrors = validateName(student.lastName)
  if (lastNameErrors.errors.length > 0)
    errors.push({ field: 'lastName', errors: lastNameErrors.errors })

  const ageErrors = validateAge(student.age)
  if (ageErrors.errors.length > 0) errors.push(ageErrors)

  const emailErrors = validateEmail(student.email)
  if (emailErrors.errors.length > 0) errors.push(emailErrors)

  return errors
}

function validateName(input: string): ValidationError {
  const name = input.trim()
  const errors: string[] = []
  const invalidChars = /[!@#$%^&*()_+~`=]/

  if (name === '') errors.push('Name cannot be empty.')

  if (name.match(invalidChars)) errors.push('Name contains invalid characters.')

  return {
    field: 'name',
    errors: errors,
  } as ValidationError
}

function validateAge(input: number): ValidationError {
  const age = input
  const errors: string[] = []

  if (isNaN(age) || age < 0 || age > 120)
    errors.push('Age must be a valid number between 0 and 120.')

  return {
    field: 'age',
    errors: errors,
  } as ValidationError
}

function validateEmail(input: string): ValidationError {
  const email = input.trim()
  const errors: string[] = []
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.match(emailPattern)) errors.push('Email must be a valid email address.')

  return {
    field: 'email',
    errors: errors,
  } as ValidationError
}

export { validateAll, validateName, validateAge, validateEmail }
