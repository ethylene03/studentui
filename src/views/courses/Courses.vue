<script lang="ts">
import { deleteCourse, getCourses } from '@/api/courses'
import ActionBar from '@/components/ActionBar.vue'
import Navbar from '@/components/Navbar.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import Table from '@/components/Table.vue'
import type { Course } from '@/models/courses'
import { Toast } from 'bootstrap'
import { debounce } from 'lodash'

export default {
  name: 'Courses',
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
      courses: [] as Course[],
      debouncedFetch: null as ((query: string) => void) | null,
    }
  },
  mounted() {
    this.fetchCourses()
    this.debouncedFetch = debounce(() => {
      this.fetchCourses(true)
    }, 500)
  },
  methods: {
    async fetchCourses(reset: boolean = false) {
      let page = 0
      if (this.$route.query.page && !reset) page = Number(this.$route.query.page) - 1
      else this.$router.replace({ query: { page: '1' } })

      const sort = this.sortWith === '' ? 'id,asc' : `${this.sortWith},${this.sortBy}`
      const size = 7

      const response = await getCourses({
        page,
        size,
        sort,
        ...(this.query ? { name: this.query } : {}),
      })
      if ('message' in response) {
        console.error('Error fetching courses:', response.message)
        return
      }

      this.totalCount = this.query ? this.totalCount : response.total
      this.pages = response.pages
      this.courses = response.data
    },

    async deleteItem(id: string) {
      if (!id) return
      const toast = document.getElementById('toast--success')

      const response = await deleteCourse(id)
      if (!response) {
        const toastInstance = new Toast(toast as HTMLElement)
        toastInstance.show()
        this.fetchCourses(true)
      }
    },

    onClickSort() {
      this.sortBy = this.sortBy === 'asc' ? 'desc' : 'asc'
      this.fetchCourses()
    },
  },
  watch: {
    '$route.query.page'() {
      this.fetchCourses()
    },
    sortWith() {
      this.sortBy = 'asc'
      this.fetchCourses()
    },
    query(value: string) {
      this.debouncedFetch?.(value)
    },
  },
}
</script>

<template>
  <section id="courses" class="w-100 d-flex flex-column vh-100">
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

    <Table :data="courses" :pages="pages" @deleteItem="deleteItem" />

    <SuccessToast message="Course deleted successfully!" />
  </section>
</template>
