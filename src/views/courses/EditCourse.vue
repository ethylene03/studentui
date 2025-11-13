<script lang="ts">
import { getCourse, updateCourse } from '@/helpers/api/courses'
import CourseForm from '@/components/CourseForm.vue'
import Navbar from '@/components/Navbar.vue'
import NoData from '@/components/NoData.vue'
import Spinner from '@/components/Spinner.vue'
import { getMessage } from '@/helpers/utils'
import type { Course } from '@/models/courses'

export default {
  name: 'EditCourse',
  components: {
    Navbar,
    CourseForm,
    Spinner,
    NoData,
  },
  data() {
    return {
      course: null as Course | null,
      id: '',
      errorMessage: '',
      isLoading: false,
    }
  },
  mounted() {
    this.fetchCourseData()
  },
  methods: {
    async fetchCourseData() {
      this.isLoading = true

      const id = this.$route.params.id as string
      const response = await getCourse(id)

      if ('message' in response) {
        if (typeof response.message !== 'string') this.errorMessage = getMessage(response.message)
        else this.errorMessage = response.message as string

        this.isLoading = false
        return
      }

      this.course = response
      this.id = id
      this.isLoading = false
    },
    async editCourse(course: Course) {
      const response = await updateCourse(this.id, course)

      if ('message' in response) {
        if (typeof response.message !== 'string') this.errorMessage = getMessage(response.message)
        else this.errorMessage = response.message as string

        return
      }
      this.$router.back()
    },
  },
}
</script>

<template>
  <section id="add-courses" class="w-100 d-flex flex-column">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <h2>Edit Course Details</h2>
      <p>Please fill in the details below.</p>
      <div v-if="errorMessage" class="text-danger">Error: {{ errorMessage }}</div>
    </div>

    <div v-if="isLoading || !course" class="container bg-white rounded-3 my-5">
      <Spinner v-if="isLoading" />
      <NoData v-else-if="!isLoading && !course" message="Course not found." />
    </div>
    <CourseForm v-else :course="course" @formData="editCourse" />
  </section>
</template>
