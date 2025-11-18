import type { ErrorResponse } from '@/models/global'
import type { Student, StudentDetails, StudentList } from '@/models/students'
import { DELETE, fetchApi, GET, POST, PUT } from './base'

async function addStudent(student: StudentDetails): Promise<Student | ErrorResponse> {
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
  query: Record<string, string>,
  signal: AbortSignal,
): Promise<StudentList | ErrorResponse | null> {
  try {
    const response = await fetchApi(GET('/students', query, signal))

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
    const response = await fetchApi(GET('/students/' + id))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as Student
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function updateStudent(
  id: string,
  student: StudentDetails,
): Promise<Student | ErrorResponse> {
  try {
    const response = await fetchApi(PUT('/students/' + id, student))

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
    const response = await fetchApi(DELETE('/students/' + id))

    if (!response.ok) return (await response.json()) as ErrorResponse
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

export { addStudent, deleteStudent, getStudent, getStudents, updateStudent }
