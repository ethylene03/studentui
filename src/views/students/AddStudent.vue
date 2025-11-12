<script lang="ts">
import { addStudent } from '@/api/students'
import Navbar from '@/components/Navbar.vue'
import StudentForm from '@/components/StudentForm.vue'
import { getMessage } from '@/helpers/utils'
import type { Student } from '@/models/students'

export default {
  name: 'AddStudent',
  components: {
    Navbar,
    StudentForm,
  },
  data() {
    return {
      errorMessage: '',
    }
  },
  methods: {
    async addStudent(student: Student) {
      const response = await addStudent(student)

      // Handle error response
      if ('message' in response) {
        if (typeof response.message !== 'string') this.errorMessage = getMessage(response.message)
        else this.errorMessage = response.message as string

        return
      }

      console.log('Student added:', response)
      this.$router.back()
    },
  },
}
</script>

<template>
  <section id="add-students" class="w-100 d-flex flex-column">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <h2>Add New Student</h2>
      <p>Please fill in the details below.</p>
      <div v-if="errorMessage" class="text-danger">Error: {{ errorMessage }}</div>
    </div>

    <StudentForm @formData="addStudent" />
  </section>
</template>
