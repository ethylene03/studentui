import type { CourseList } from '@/models/courses'
import { defineStore } from 'pinia'

type CourseState = {
  courses: CourseList
  lastFetched: number
}

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    cache: {} as Record<string, CourseState>,
  }),

  actions: {
    get(key: string): CourseList | null {
      const courseState = this.cache[key]
      if (!courseState) return null

      courseState.lastFetched = Date.now()
      return courseState.courses
    },

    set(key: string, newList: CourseList) {
      this.cache[key] = {
        courses: newList,
        lastFetched: Date.now(),
      }
    },
  },
})
