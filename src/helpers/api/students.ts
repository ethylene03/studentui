import type { Student, StudentList } from '@/models/students'
import { DELETE, GET, POST, PUT } from './base'
import type { ErrorResponse } from '@/models/global'

async function addStudent(student: Student): Promise<Student | ErrorResponse> {
  try {
    const response = await fetch(POST('/students', student))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as Student
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function getStudents(
  query: Object,
  signal: AbortSignal,
): Promise<StudentList | ErrorResponse | null> {
  try {
    const response = await fetch(GET('/students', query, signal))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as StudentList
  } catch (error) {
    if (error instanceof DOMException) return null

    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function getStudent(id: string): Promise<Student | ErrorResponse> {
  try {
    const response = await fetch(GET('/students/' + id))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as Student
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function updateStudent(id: string, student: Student): Promise<Student | ErrorResponse> {
  try {
    const response = await fetch(PUT('/students/' + id, student))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as Student
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function deleteStudent(id: string): Promise<void | ErrorResponse> {
  try {
    const response = await fetch(DELETE('/students/' + id))

    if (!response.ok) return (await response.json()) as ErrorResponse
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

export { addStudent, getStudents, getStudent, updateStudent, deleteStudent }
