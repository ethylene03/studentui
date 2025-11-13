import type { ValidationError } from '@/models/global'

function validateCourseName(input: string): ValidationError {
  const courseName = input.trim()
  const errors: string[] = []
  const invalidChars = /[!@#$%^&*()_+\-={}\[\]:";'<>.,?\/]/

  if (courseName == '') errors.push('Course name cannot be empty.')

  if (courseName.match(invalidChars)) errors.push('Course name contains invalid characters.')

  return {
    field: 'name',
    errors: errors,
  } as ValidationError
}

export { validateCourseName }
