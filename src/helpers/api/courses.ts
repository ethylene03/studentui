import type { Course, CourseList } from '@/models/courses'
import { DELETE, fetchApi, GET, POST, PUT } from './base'
import type { ErrorResponse } from '@/models/global'

async function addCourse(course: Course): Promise<Course | ErrorResponse> {
  try {
    const response = await fetchApi(POST('/courses', course))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as Course
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function getCourses(
  query: Object,
  signal: AbortSignal,
): Promise<CourseList | ErrorResponse | null> {
  try {
    const response = await fetchApi(GET('/courses', query, signal))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as CourseList
  } catch (error) {
    if (error instanceof DOMException) return null

    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function getCourse(id: string): Promise<Course | ErrorResponse> {
  try {
    const response = await fetchApi(GET('/courses/' + id))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as Course
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function updateCourse(id: string, course: Course): Promise<Course | ErrorResponse> {
  try {
    const response = await fetchApi(PUT('/courses/' + id, course))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as Course
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function deleteCourse(id: string): Promise<void | ErrorResponse> {
  try {
    const response = await fetchApi(DELETE('/courses/' + id))

    if (!response.ok) return (await response.json()) as ErrorResponse
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

export { addCourse, getCourses, getCourse, updateCourse, deleteCourse }
