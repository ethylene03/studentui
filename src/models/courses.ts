export interface Course {
  id: string
  name: string
}

export type CourseDetails = Omit<Course, 'id'>

export interface CourseList {
  total: number
  pages: number
  page: number
  size: number
  data: Course[]
}
