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
      this.cache[key] = {
        students: newList,
        lastFetched: Date.now(),
      }
    },
  },
})
