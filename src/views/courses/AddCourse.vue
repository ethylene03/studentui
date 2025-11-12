<script lang="ts">
import { addCourse } from '@/api/courses'
import CourseForm from '@/components/CourseForm.vue'
import Navbar from '@/components/Navbar.vue'
import { getMessage } from '@/helpers/utils'
import type { Course } from '@/models/courses'

export default {
  name: 'AddCourse',
  components: {
    Navbar,
    CourseForm,
  },
  data() {
    return {
      errorMessage: '',
      nameError: [] as string[],
    }
  },
  methods: {
    async addCourse(course: Course) {
      const response = await addCourse(course)

      // Handle error response
      if ('message' in response) {
        if (typeof response.message !== 'string') this.errorMessage = getMessage(response.message)
        else this.errorMessage = response.message as string

        return
      }

      console.log('Course added:', response)
      this.$router.back()
    },
  },
}
</script>

<template>
  <section id="add-courses" class="w-100 d-flex flex-column">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <h2>Add New Course</h2>
      <p>Please fill in the details below.</p>
      <div v-if="errorMessage" class="text-danger">Error: {{ errorMessage }}</div>
    </div>

    <CourseForm @formData="addCourse" :errors="nameError" />
  </section>
</template>
