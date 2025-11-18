export interface Student {
  id: string
  studentId: string
  firstName: string
  lastName: string
  age: number
  email: string
  course: string
}

export type StudentDetails = Omit<Student, 'id'>

export interface StudentList {
  total: number
  pages: number
  page: number
  size: number
  data: Student[]
}
