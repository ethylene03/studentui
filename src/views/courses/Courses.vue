<script setup lang="ts">
import ActionBar from '@/components/ActionBar.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import Table from '@/components/Table.vue'
import { deleteCourse, getCourses } from '@/helpers/api/courses'
import { useCoursesStore } from '@/helpers/stores/courses'
import { buildCacheKey, isError } from '@/helpers/utils'
import type { Course, CourseList } from '@/models/courses'
import { Modal, Toast } from 'bootstrap'
import { debounce } from 'lodash'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

onMounted(() => {
  fetchCourses()
  debouncedFetch.value = debounce(() => {
    fetchCourses(true)
  }, 500)
})

const route = useRoute()
const router = useRouter()

/*<--------- FETCH COURSES --------->*/

const totalCount = ref<number>(0)
const pages = ref<number>(0)
const courses = ref<Course[]>([])
const controller = ref<AbortController | null>(null)

async function fetchCourses(reset: boolean = false) {
  setLoading()

  if (controller.value) controller.value.abort()
  controller.value = new AbortController()

  const query = getQuery(reset)
  const cache = useCoursesStore()
  getCache(query, cache)

  const response = await getCourses(query, controller.value.signal)
  if (!response || isError(response)) {
    clearLoading()
    return
  }

  totalCount.value = search.value ? totalCount.value : response.total
  pages.value = response.pages
  courses.value = response.data

  const cacheKey = buildCacheKey(query)
  cache.set(cacheKey, response)

  clearLoading()
}

function getCache(query: Record<string, string>, cache: ReturnType<typeof useCoursesStore>) {
  const cacheKey = buildCacheKey(query)

  const cachedList = cache.get(cacheKey)

  if (cachedList) {
    totalCount.value = cachedList.total
    pages.value = cachedList.pages
    courses.value = cachedList.data

    clearLoading()
  }
}

watch(
  () => route.query.page,
  () => {
    fetchCourses()
  },
)

/*<--------- GET QUERY DETAILS --------->*/

const sortWith = ref<string>('')
const sortBy = ref<string>('asc')
const search = ref<string | null>(null)

function getQuery(reset: boolean): Record<string, string> {
  let page = 0
  if (route.query.page && !reset) page = Number(route.query.page) - 1

  const sort = sortWith.value === '' ? 'id,asc' : `${sortWith.value},${sortBy.value}`
  const size = 7

  return {
    page: page.toString(),
    size: size.toString(),
    sort,
    ...(search.value ? { name: search.value } : {}),
  }
}

/*<--------- MANAGE LOADING STATE --------->*/

const timeoutID = ref<number | null>(null)
const isLoading = ref<boolean>(false)

function setLoading() {
  timeoutID.value = window.setTimeout(() => {
    isLoading.value = true
  }, 300)
}

function clearLoading() {
  clearTimeout(timeoutID.value!)
  isLoading.value = false
}

/*<--------- DEBOUNCING FETCH --------->*/

const debouncedFetch = ref<((search: string) => void) | null>(null)

watch(search, () => {
  debouncedFetch.value?.(search.value || '')
})

/*<--------- HANDLE SORTING --------->*/

watch(sortWith, () => {
  sortBy.value = 'asc'
  fetchCourses()
})

function onClickSort() {
  sortBy.value = sortBy.value === 'asc' ? 'desc' : 'asc'
  fetchCourses()
}

/*<--------- DELETE COURSE --------->*/

const toDeleteId = ref<string>('')

function showDeleteModal(id: string) {
  toDeleteId.value = id

  const modal = document.getElementById('modal--delete')
  if (modal) {
    const modalInstance = new Modal(modal as HTMLElement)
    modalInstance.show()
  }
}

async function deleteItem() {
  if (!toDeleteId) return
  const toast = document.getElementById('toast--delete-course')
  const modal = document.getElementById('modal--delete')

  const response = await deleteCourse(toDeleteId.value)
  if (!response) {
    const modalInstance = Modal.getInstance(modal as HTMLElement)
    modalInstance?.hide()

    const toastInstance = new Toast(toast as HTMLElement)
    toastInstance.show()

    totalCount.value -= 1
    fetchCourses(true)
  }
}
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

    <SuccessToast id="toast--delete-course" message="Course deleted successfully!" />
    <DeleteModal @delete="deleteItem" />
  </section>
</template>
