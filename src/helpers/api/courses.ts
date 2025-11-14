import type { Course, CourseList } from '@/models/courses'
import api from './api'
import { CanceledError, type AxiosError } from 'axios'
import type { ErrorResponse } from '@/models/global'

async function addCourse(course: Course): Promise<Course | ErrorResponse> {
  try {
    const response = await api.post('/courses', course)
    return response.data as Course
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function getCourses(
  query: Object,
  signal: AbortSignal,
): Promise<CourseList | ErrorResponse | null> {
  try {
    const response = await api.get('/courses', { params: query, signal })
    return response.data as CourseList
  } catch (error) {
    if (error instanceof CanceledError) return null
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function getCourse(id: string): Promise<Course | ErrorResponse> {
  try {
    const response = await api.get('/courses/' + id)
    return response.data as Course
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function updateCourse(id: string, course: Course): Promise<Course | ErrorResponse> {
  try {
    const response = await api.put('/courses/' + id, course)
    return response.data as Course
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function deleteCourse(id: string): Promise<null | ErrorResponse> {
  try {
    await api.delete('/courses/' + id)
    return null
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

export { addCourse, getCourses, getCourse, updateCourse, deleteCourse }
