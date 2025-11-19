<script setup lang="ts">
import ActionBar from '@/components/ActionBar.vue'
import DataTable from '@/components/DataTable.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import NavBar from '@/components/NavBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import SuccessToast from '@/components/SuccessToast.vue'
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
    currentPage.value = 1
    load()
  }, 500)
})

const route = useRoute()

/*<--------- DATA --------->*/

const debouncedFetch = ref<((search: string) => void) | null>(null)
const totalCount = ref<number>(0)
const pages = ref<number>(0)
const currentPage = ref<number>(1)
const courses = ref<Course[]>([])

/*<--------- COMPOSABLES --------->*/

const { fetchData: fetchCourses, fetchCachedData: fetchCachedCourses } =
  useFetchData<CourseList>('course')
const { sortWith, sortBy, search, getQuery, onClickSort } = useBuildQuery('course')
const { showDeleteModal, deleteItem } = useDeleteItem('course')
const { isLoading, setLoading, clearLoading } = useLoadingState()

/*<--------- LOAD COURSES --------->*/

async function load() {
  setLoading()
  const query = getQuery(currentPage.value)

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
  load()
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

watch([sortBy, currentPage], () => {
  load()
})

watch(search, () => {
  debouncedFetch.value?.(search.value || '')
})
</script>

<template>
  <section id="courses" class="w-100">
    <nav-bar />

    <div class="container mt-5 text-center text-md-start">
      <page-header
        title="Course Directory"
        :description="'Total courses offered: ' + totalCount"
        type="Main"
      />
      <action-bar
        label="Course"
        :sort-options="Object.keys(courses[0] || {})"
        @on-search-text="search = $event"
        @on-click-sort-by="onClickSort"
        @on-change-sort-with="sortWith = $event"
      />
    </div>

    <data-table
      :data="courses"
      :pages="pages"
      :current-page="currentPage"
      @on-change-page="(e) => (currentPage = e)"
      @delete-item="showDeleteModal"
      :is-loading="isLoading"
    />

    <success-toast id="toast--delete" message="Course deleted successfully!" />
    <delete-modal @delete="onDeleteItem" />
  </section>
</template>
