import { ref } from 'vue'
import { useRoute } from 'vue-router'

export function useBuildQuery(type: 'course' | 'student') {
  const route = useRoute()

  const sortWith = ref<string>('')
  const sortBy = ref<string>('asc')
  const search = ref<string | null>(null)

  function getQuery(reset: boolean = false): Record<string, string> {
    let page = 0
    if (route.query.page && !reset) page = Number(route.query.page) - 1

    const sort = sortWith.value === '' ? 'id,asc' : `${sortWith.value},${sortBy.value}`

    return {
      page: page.toString(),
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
