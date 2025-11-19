<script setup lang="ts">
import ActionBar from '@/components/ActionBar.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import Table from '@/components/Table.vue'
import { useBuildQuery } from '@/helpers/composables/buildQuery'
import { useDeleteItem } from '@/helpers/composables/deleteItem'
import { useFetchData } from '@/helpers/composables/fetchData'
import { useLoadingState } from '@/helpers/composables/loadingState'
import { buildCacheKey } from '@/helpers/utils'
import type { Course, CourseList } from '@/models/courses'
import { debounce } from 'lodash'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

onMounted(() => {
  load()
  debouncedFetch.value = debounce(() => {
    load(true)
  }, 500)
})

const route = useRoute()

/*<--------- DATA --------->*/

const debouncedFetch = ref<((search: string) => void) | null>(null)
const totalCount = ref<number>(0)
const pages = ref<number>(0)
const courses = ref<Course[]>([])

/*<--------- COMPOSABLES --------->*/

const { fetchData: fetchCourses, fetchCachedData: fetchCachedCourses } =
  useFetchData<CourseList>('course')
const { sortWith, sortBy, search, getQuery, onClickSort } = useBuildQuery('course')
const { showDeleteModal, deleteItem } = useDeleteItem('course')
const { isLoading, setLoading, clearLoading } = useLoadingState()

/*<--------- LOAD COURSES --------->*/

async function load(reset = false) {
  setLoading()
  const query = getQuery(reset)

  const cacheKey = buildCacheKey(query)
  const cachedData = fetchCachedCourses(cacheKey)

  if (cachedData) {
    courses.value = cachedData.data
    totalCount.value = search.value ? totalCount.value : cachedData.total
    pages.value = cachedData.pages

    clearLoading()
  }

  const response = await fetchCourses(query)
  if (!response) {
    clearLoading()
    return
  }

  courses.value = response.data
  totalCount.value = search.value ? totalCount.value : response.total
  pages.value = response.pages

  clearLoading()
}

/*<--------- DELETE COURSE --------->*/

async function onDeleteItem() {
  await deleteItem()

  totalCount.value -= 1
  load(true)
}

/*<--------- WATCHERS --------->*/

watch(
  () => route.query.page,
  () => {
    load()
  },
)

watch(sortWith, () => {
  sortBy.value = 'asc'
  load()
})

watch(sortBy, () => {
  load()
})

watch(search, () => {
  debouncedFetch.value?.(search.value || '')
})
</script>

<template>
  <section id="courses" class="w-100">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <Header
        title="Course Directory"
        :description="'Total courses offered: ' + totalCount"
        type="Main"
      />
      <ActionBar
        label="Course"
        :sortOptions="Object.keys(courses[0] || {})"
        @onSearchText="search = $event"
        @onClickSortBy="onClickSort"
        @onChangeSortWith="sortWith = $event"
      />
    </div>

    <Table :data="courses" :pages="pages" @deleteItem="showDeleteModal" :isLoading="isLoading" />

    <SuccessToast id="toast--delete" message="Course deleted successfully!" />
    <DeleteModal @delete="onDeleteItem" />
  </section>
</template>
