<script lang="ts">
import { deleteCourse, getCourses } from '@/helpers/api/courses'
import ActionBar from '@/components/ActionBar.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import Navbar from '@/components/Navbar.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import Table from '@/components/Table.vue'
import type { Course } from '@/models/courses'
import { Modal, Toast } from 'bootstrap'
import { debounce } from 'lodash'

export default {
  name: 'Courses',
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
      courses: [] as Course[],
      toDeleteId: '',
      isLoading: false,
      debouncedFetch: null as ((query: string) => void) | null,
      controller: null as AbortController | null,
      timeoutID: null as number | null,
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
      this.timeoutID = window.setTimeout(() => {
        this.isLoading = true
      }, 300)

      if (this.controller) this.controller.abort()
      this.controller = new AbortController()

      let page = 0
      if (this.$route.query.page && !reset) page = Number(this.$route.query.page) - 1

      const sort = this.sortWith === '' ? 'id,asc' : `${this.sortWith},${this.sortBy}`
      const size = 7

      const response = await getCourses(
        {
          page,
          size,
          sort,
          ...(this.query ? { name: this.query } : {}),
        },
        this.controller.signal,
      )

      if (!response || 'message' in response) {
        clearTimeout(this.timeoutID!)
        this.isLoading = false
        return
      }

      this.totalCount = this.query ? this.totalCount : response.total
      this.pages = response.pages
      this.courses = response.data

      clearTimeout(this.timeoutID!)
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

      const response = await deleteCourse(this.toDeleteId)
      if (!response) {
        const modalInstance = Modal.getInstance(modal as HTMLElement)
        modalInstance?.hide()

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

    <Table :data="courses" :pages="pages" @deleteItem="handleClickDelete" :isLoading="isLoading" />

    <SuccessToast message="Course deleted successfully!" />
    <DeleteModal @delete="deleteItem" />
  </section>
</template>
