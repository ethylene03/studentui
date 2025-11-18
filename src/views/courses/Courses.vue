<script setup lang="ts">
import type { Course } from '@/models/courses'
import { Modal, Toast } from 'bootstrap'
import { debounce } from 'lodash'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteCourse, getCourses } from '@/helpers/api/courses'
import ActionBar from '@/components/ActionBar.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import Navbar from '@/components/Navbar.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import Table from '@/components/Table.vue'

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

  const response = await getCourses(getQuery(reset), controller.value.signal)

  if (!response || 'message' in response) {
    clearLoading()
    return
  }

  totalCount.value = query.value ? totalCount.value : response.total
  pages.value = response.pages
  courses.value = response.data

  if (route.query.page !== response.page.toString()) {
    router.push({ query: { ...route.query, page: (response.page + 1).toString() } })
  }

  clearLoading()
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
const query = ref<string | null>(null)

function getQuery(reset: boolean) {
  let page = 0
  if (route.query.page && !reset) page = Number(route.query.page) - 1

  const sort = sortWith.value === '' ? 'id,asc' : `${sortWith.value},${sortBy.value}`
  const size = 7

  return { page, size, sort, ...(query.value ? { name: query.value } : {}) }
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

const debouncedFetch = ref<((query: string) => void) | null>(null)

watch(query, () => {
  debouncedFetch.value?.(query.value || '')
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

    fetchCourses(true)
  }
}
</script>

<template>
  <section id="courses" class="w-100">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <h2>Course Directory</h2>
      <p class="lead text-primary">Total courses offered: {{ totalCount }}</p>
      <ActionBar
        label="Course"
        :sortOptions="Object.keys(courses[0] || {})"
        @onSearchText="query = $event"
        @onClickSortBy="onClickSort"
        @onChangeSortWith="sortWith = $event"
      />
    </div>

    <Table :data="courses" :pages="pages" @deleteItem="showDeleteModal" :isLoading="isLoading" />

    <SuccessToast id="toast--delete-course" message="Course deleted successfully!" />
    <DeleteModal @delete="deleteItem" />
  </section>
</template>
