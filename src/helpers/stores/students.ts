import type { StudentList } from '@/models/students'
import { defineStore } from 'pinia'

type StudentState = {
  students: StudentList
  lastFetched: number
}

export const useStudentsStore = defineStore('students', {
  state: () => ({
    cache: {} as Record<string, StudentState>,
  }),

  actions: {
    get(key: string): StudentList | null {
      const studentState = this.cache[key]
      if (!studentState) return null

      studentState.lastFetched = Date.now()
      return studentState.students
    },

    set(key: string, newList: StudentList) {
      this.pruneStaleCache()
      this.cache[key] = {
        students: newList,
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
