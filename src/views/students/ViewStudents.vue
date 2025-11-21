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
import type { Student, StudentList } from '@/models/students'
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

const debouncedFetch = ref<((query: string) => void) | null>(null)
const totalCount = ref<number>(0)
const pages = ref<number>(0)
const currentPage = ref<number>(1)
const students = ref<Student[]>([])

/*<--------- COMPOSABLES --------->*/

const { fetchData: fetchStudents, fetchCachedData: fetchCachedStudents } =
  useFetchData<StudentList>('student')
const { sortWith, sortBy, search, getQuery, onClickSort } = useBuildQuery('student')
const { showDeleteModal, deleteItem } = useDeleteItem('student')
const { isLoading, setLoading, clearLoading } = useLoadingState()

/*<--------- LOAD STUDENTS --------->*/

async function load() {
  setLoading()
  const query = getQuery(currentPage.value)

  const cacheKey = buildCacheKey(query)
  const cachedData = fetchCachedStudents(cacheKey)

  if (cachedData) {
    totalCount.value = search.value ? totalCount.value : cachedData.total
    pages.value = cachedData.pages
    students.value = cachedData.data

    clearLoading()
  }

  const response = await fetchStudents(query)
  if (!response) {
    clearLoading()
    return
  }

  totalCount.value = search.value ? totalCount.value : response.total
  pages.value = response.pages
  students.value = response.data

  clearLoading()
}

/*<--------- DELETE STUDENT --------->*/

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
  <section id="students" class="w-100">
    <nav-bar />

    <div class="container mt-5 text-center text-md-start">
      <page-header
        title="Student Directory"
        :description="'Total students enrolled: ' + totalCount"
        type="Main"
      />
      <action-bar
        label="Student"
        :sort-options="Object.keys(students[0] || {})"
        @on-search-text="search = $event"
        @on-click-sort-by="onClickSort"
        @on-change-sort-with="sortWith = $event"
      />
    </div>

    <data-table
      :data="students"
      :pages="pages"
      :current-page="currentPage"
      @on-change-page="(e: number) => (currentPage = e)"
      @delete-item="showDeleteModal"
      :is-loading="isLoading"
    />

    <success-toast id="toast--delete" message="Student deleted successfully!" />
    <delete-modal @delete="onDeleteItem" />
  </section>
</template>
