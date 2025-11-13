<script lang="ts">
import { getCourse, updateCourse } from '@/api/courses'
import CourseForm from '@/components/CourseForm.vue'
import Navbar from '@/components/Navbar.vue'
import { getMessage } from '@/helpers/utils'
import type { Course } from '@/models/courses'

export default {
  name: 'EditCourse',
  components: {
    Navbar,
    CourseForm,
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
      <div
        v-if="isLoading"
        class="spinner-border text-primary d-block mx-auto my-5"
        role="status"
      ></div>
      <div v-else-if="!isLoading && !course" class="text-center my-5">
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg?semt=ais_incoming&w=740&q=80"
          alt="no data available"
          class="d-block mx-auto my-5 w-25"
        />
        <p class="text-center my-5">Course not found.</p>
      </div>
    </div>
    <CourseForm v-else :course="course" @formData="editCourse" />
  </section>
</template>
