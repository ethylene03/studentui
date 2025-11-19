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
      this.pruneStaleCache()
      this.cache[key] = {
        courses: newList,
        lastFetched: Date.now(),
      }
    },

    pruneStaleCache() {
      const STALE_TIME = 1000 * 60 * 5
      const now = Date.now()

      for (const key in this.cache) {
        const entry = this.cache[key]

        if (entry && now - entry.lastFetched > STALE_TIME) {
          delete this.cache[key]
        }
      }
    },
  },
})
