<script setup lang="ts">
import ActionBar from '@/components/ActionBar.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import Table from '@/components/Table.vue'
import { deleteStudent, getStudents } from '@/helpers/api/students'
import { isError } from '@/helpers/utils'
import type { Student } from '@/models/students'
import { Modal, Toast } from 'bootstrap'
import { debounce } from 'lodash'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

onMounted(() => {
  fetchStudents()
  debouncedFetch.value = debounce(() => {
    fetchStudents(true)
  }, 500)
})

const route = useRoute()
const router = useRouter()

/*<--------- FETCH STUDENTS --------->*/

const totalCount = ref<number>(0)
const pages = ref<number>(0)
const students = ref<Student[]>([])
const controller = ref<AbortController | null>(null)

async function fetchStudents(reset: boolean = false) {
  setLoading()

  if (controller.value) controller.value.abort()
  controller.value = new AbortController()

  const response = await getStudents(getQuery(reset), controller.value.signal)

  if (!response || isError(response)) {
    clearLoading()
    return
  }

  totalCount.value = query.value ? totalCount.value : response.total
  pages.value = response.pages
  students.value = response.data

  if (route.query.page !== response.page.toString()) {
    router.push({ query: { ...route.query, page: (response.page + 1).toString() } })
  }

  clearLoading()
}

watch(
  () => route.query.page,
  () => {
    fetchStudents()
  },
)

/*<--------- GET QUERY DETAILS --------->*/

const sortWith = ref<string>('')
const sortBy = ref<string>('asc')
const query = ref<string | null>(null)

function getQuery(reset: boolean): Record<string, string> {
  let page = 0
  if (route.query.page && !reset) page = Number(route.query.page) - 1

  const sort = sortWith.value === '' ? 'id,asc' : `${sortWith.value},${sortBy.value}`
  const size = 7

  return {
    page: page.toString(),
    size: size.toString(),
    sort,
    ...(query.value ? { query: query.value } : {}),
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

const debouncedFetch = ref<((query: string) => void) | null>(null)

watch(query, () => {
  debouncedFetch.value?.(query.value || '')
})

/*<--------- HANDLE SORTING --------->*/

watch(sortWith, () => {
  sortBy.value = 'asc'
  fetchStudents()
})

function onClickSort() {
  sortBy.value = sortBy.value === 'asc' ? 'desc' : 'asc'
  fetchStudents()
}

/*<--------- DELETE STUDENT --------->*/

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
  const toast = document.getElementById('toast--delete-student')
  const modal = document.getElementById('modal--delete')

  const response = await deleteStudent(toDeleteId.value)
  if (!response) {
    const modalInstance = Modal.getInstance(modal as HTMLElement)
    modalInstance?.hide()

    const toastInstance = new Toast(toast as HTMLElement)
    toastInstance.show()

    fetchStudents(true)
  }
}
</script>

<template>
  <section id="students" class="w-100">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <Header
        title="Student Directory"
        :description="'Total students enrolled: ' + totalCount"
        type="Main"
      />
      <ActionBar
        label="Student"
        :sortOptions="Object.keys(students[0] || {})"
        @onSearchText="query = $event"
        @onClickSortBy="onClickSort"
        @onChangeSortWith="sortWith = $event"
      />
    </div>

    <Table :data="students" :pages="pages" @deleteItem="showDeleteModal" :isLoading="isLoading" />

    <SuccessToast id="toast--delete-student" message="Student deleted successfully!" />
    <DeleteModal @delete="deleteItem" />
  </section>
</template>
