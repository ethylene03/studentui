export interface Course {
  id?: number
  name: string
}

export interface CourseList {
  total: number
  pages: number
  page: number
  size: number
  data: Course[]
}
