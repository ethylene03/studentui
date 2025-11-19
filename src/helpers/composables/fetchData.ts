import { buildCacheKey, isError } from '@/helpers/utils'
import type { CourseList } from '@/models/courses'
import type { StudentList } from '@/models/students'
import { ref } from 'vue'
import { getCourses } from '../api/courses'
import { useCoursesStore } from '../stores/courses'
import { useStudentsStore } from '../stores/students'
import { getStudents } from '../api/students'

export function useFetchData<T extends CourseList | StudentList>(type: 'course' | 'student') {
  const controller = ref<AbortController | null>(null)

  async function fetchData(query: Record<string, string>): Promise<T | null> {
    if (controller.value) controller.value.abort()
    controller.value = new AbortController()

    const cacheKey = buildCacheKey(query)

    const response =
      type === 'student'
        ? await getStudents(query, controller.value.signal)
        : await getCourses(query, controller.value.signal)

    if (!response || isError(response)) {
      return null
    }

    if (type === 'student') {
      const studentsStore = useStudentsStore()
      studentsStore.set(cacheKey, response as StudentList)
    } else {
      const coursesStore = useCoursesStore()
      coursesStore.set(cacheKey, response as CourseList)
    }

    return response as T
  }

  function fetchCachedData(cacheKey: string): T | null {
    let cachedList: T | null

    if (type === 'student') {
      const studentsStore = useStudentsStore()
      cachedList = studentsStore.get(cacheKey) as T | null
    } else {
      const coursesStore = useCoursesStore()
      cachedList = coursesStore.get(cacheKey) as T | null
    }

    return cachedList
  }

  return { fetchData, fetchCachedData }
}
