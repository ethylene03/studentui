<script lang="ts">
import { deleteStudent, getStudents } from '@/helpers/api/students'
import ActionBar from '@/components/ActionBar.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import Navbar from '@/components/Navbar.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import Table from '@/components/Table.vue'
import type { Student } from '@/models/students'
import { Modal, Toast } from 'bootstrap'
import { debounce } from 'lodash'

export default {
  name: 'Students',
  components: {
    Navbar,
    Table,
    ActionBar,
    SuccessToast,
    DeleteModal,
  },
  data() {
    return {
      totalCount: 0,
      pages: 0,
      sortWith: '',
      sortBy: 'asc',
      query: null as string | null,
      students: [] as Student[],
      toDeleteId: '',
      isLoading: false,
      debouncedFetch: null as ((query: string) => void) | null,
    }
  },
  mounted() {
    this.fetchStudents()
    this.debouncedFetch = debounce(() => {
      this.fetchStudents(true)
    }, 500)
  },
  methods: {
    async fetchStudents(reset: boolean = false) {
      this.isLoading = true

      let page = 0
      if (this.$route.query.page && !reset) page = Number(this.$route.query.page) - 1
      else this.$router.replace({ query: { page: '1' } })

      const sort = this.sortWith === '' ? 'id,asc' : `${this.sortWith},${this.sortBy}`
      const size = 7

      const response = await getStudents({
        page,
        size,
        sort,
        ...(this.query ? { query: this.query } : {}),
      })

      if ('message' in response) {
        console.error('Error fetching students:', response.message)
        this.isLoading = false
        return
      }

      this.totalCount = this.query ? this.totalCount : response.total
      this.pages = response.pages
      this.students = response.data
      this.isLoading = false
    },

    handleClickDelete(id: string) {
      this.toDeleteId = id

      const modal = document.getElementById('modal--delete')
      if (modal) {
        const modalInstance = new Modal(modal as HTMLElement)
        modalInstance.show()
      }
    },

    async deleteItem() {
      if (!this.toDeleteId) return
      const toast = document.getElementById('toast--success')
      const modal = document.getElementById('modal--delete')

      const response = await deleteStudent(this.toDeleteId)
      if (!response) {
        const modalInstance = Modal.getInstance(modal as HTMLElement)
        modalInstance?.hide()

        const toastInstance = new Toast(toast as HTMLElement)
        toastInstance.show()

        this.fetchStudents()
      }
    },

    onClickSort() {
      this.sortBy = this.sortBy === 'asc' ? 'desc' : 'asc'
      this.fetchStudents()
    },
  },
  watch: {
    '$route.query.page'() {
      this.fetchStudents()
    },
    sortWith() {
      this.sortBy = 'asc'
      this.fetchStudents()
    },
    query(value: string) {
      this.debouncedFetch?.(value)
    },
  },
}
</script>

<template>
  <section id="students" class="w-100">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <h2>Student Directory</h2>
      <p class="lead text-primary">Total students enrolled: {{ totalCount }}</p>
      <ActionBar
        label="Student"
        :sortOptions="Object.keys(students[0] || {})"
        @onSearchText="query = $event"
        @onClickSortBy="onClickSort"
        @onChangeSortWith="sortWith = $event"
      />
    </div>

    <Table :data="students" :pages="pages" @deleteItem="handleClickDelete" :isLoading="isLoading" />

    <SuccessToast message="Student deleted successfully!" />
    <DeleteModal @delete="deleteItem" />
  </section>
</template>
