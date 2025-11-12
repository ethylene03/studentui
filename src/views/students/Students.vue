<script lang="ts">
import { deleteStudent, getStudents } from '@/api/students'
import ActionBar from '@/components/ActionBar.vue'
import Navbar from '@/components/Navbar.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import Table from '@/components/Table.vue'
import type { Student } from '@/models/students'
import { Toast } from 'bootstrap'

export default {
  name: 'Students',
  components: {
    Navbar,
    Table,
    ActionBar,
    SuccessToast,
  },
  data() {
    return {
      totalCount: 0,
      pages: 0,
      sortWith: '',
      sortBy: 'asc',
      query: null as string | null,
      students: [] as Student[],
    }
  },
  mounted() {
    this.fetchStudents()
  },
  methods: {
    async fetchStudents() {
      const page = this.$route.query.page ? Number(this.$route.query.page) - 1 : 0
      const sort = this.sortWith === '' ? 'id,asc' : `${this.sortWith},${this.sortBy}`

      const response = await getStudents({
        page,
        sort,
        ...(this.query ? { query: this.query } : {}),
      })
      if ('message' in response) {
        console.error('Error fetching students:', response.message)
        return
      }

      this.totalCount = response.total
      this.pages = response.pages
      this.students = response.data
    },

    async deleteItem(id: string) {
      if (!id) return
      const toast = document.getElementById('toast--success')

      const response = await deleteStudent(id)
      if (!response) {
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
    query() {
      this.$router.replace({ query: { page: '1' } })
      this.fetchStudents()
    },
  },
}
</script>

<template>
  <section id="students" class="w-100 d-flex flex-column vh-100">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <h2>Student Directory</h2>
      <p class="lead">Total students enrolled: {{ totalCount }}</p>
      <ActionBar
        label="Student"
        :sortOptions="Object.keys(students[0] || {})"
        @onSearchText="query = $event"
        @onClickSortBy="onClickSort"
        @onChangeSortWith="sortWith = $event"
      />
    </div>

    <Table :data="students" :pages="pages" @deleteItem="deleteItem" />

    <SuccessToast message="Student deleted successfully!" />
  </section>
</template>
