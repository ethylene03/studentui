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
import type { Student, StudentList } from '@/models/students'
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

/*<--------- COMPOSABLES --------->*/

const { fetchData: fetchStudents, fetchCachedData: fetchCachedStudents } =
  useFetchData<StudentList>('student')
const { sortWith, sortBy, search, getQuery, onClickSort } = useBuildQuery('student')
const { showDeleteModal, deleteItem } = useDeleteItem('student')
const { isLoading, setLoading, clearLoading } = useLoadingState()

/*<--------- DATA --------->*/

const debouncedFetch = ref<((query: string) => void) | null>(null)
const totalCount = ref<number>(0)
const pages = ref<number>(0)
const students = ref<Student[]>([])

/*<--------- LOAD STUDENTS --------->*/

async function load(reset: boolean = false) {
  setLoading()
  const query = getQuery(reset)

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
        @onSearchText="search = $event"
        @onClickSortBy="onClickSort"
        @onChangeSortWith="sortWith = $event"
      />
    </div>

    <Table :data="students" :pages="pages" @deleteItem="showDeleteModal" :isLoading="isLoading" />

    <SuccessToast id="toast--delete" message="Student deleted successfully!" />
    <DeleteModal @delete="onDeleteItem" />
  </section>
</template>
