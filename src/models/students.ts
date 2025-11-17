export interface Student {
  id?: string
  studentId: string
  firstName: string
  lastName: string
  age: number
  email: string
  course: string
}

export interface StudentList {
  total: number
  pages: number
  page: number
  size: number
  data: Student[]
}
