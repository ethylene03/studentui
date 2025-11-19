import { ref } from 'vue'

export function useBuildQuery(type: 'course' | 'student') {
  const sortWith = ref<string>('')
  const sortBy = ref<string>('asc')
  const search = ref<string | null>(null)

  function getQuery(currentPage: number = 1): Record<string, string> {
    const sort = sortWith.value === '' ? 'id,asc' : `${sortWith.value},${sortBy.value}`

    return {
      page: (currentPage - 1).toString(),
      size: '7',
      sort,
      ...(search.value ? { [type === 'student' ? 'query' : 'name']: search.value } : {}),
    }
  }

  function onClickSort() {
    sortBy.value = sortBy.value === 'asc' ? 'desc' : 'asc'
  }

  return { sortWith, sortBy, search, getQuery, onClickSort }
}
