import type { Student, StudentList } from '@/models/students'
import api from './api'
import type { ErrorResponse } from '@/models/global'
import { type AxiosError, CanceledError } from 'axios'

async function addStudent(student: Student): Promise<Student | ErrorResponse> {
  try {
    const response = await api.post('/students', student)
    return response.data as Student
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function getStudents(
  query: Object,
  signal: AbortSignal,
): Promise<StudentList | ErrorResponse | null> {
  try {
    const response = await api.get('/students', { params: query, signal })
    return response.data as StudentList
  } catch (error) {
    if(error instanceof CanceledError) return null
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function getStudent(id: string): Promise<Student | ErrorResponse> {
  try {
    const response = await api.get('/students/' + id)
    return response.data as Student
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function updateStudent(id: string, student: Student): Promise<Student | ErrorResponse> {
  try {
    const response = await api.put('/students/' + id, student)
    return response.data as Student
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function deleteStudent(id: string): Promise<null | ErrorResponse> {
  try {
    await api.delete('/students/' + id)
    return null
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

export { addStudent, getStudents, getStudent, updateStudent, deleteStudent }
