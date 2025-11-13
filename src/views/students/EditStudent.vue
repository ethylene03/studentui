<script lang="ts">
import { getStudent, updateStudent } from '@/api/students'
import Navbar from '@/components/Navbar.vue'
import StudentForm from '@/components/StudentForm.vue'
import { getMessage } from '@/helpers/utils'
import type { Student } from '@/models/students'

export default {
  name: 'EditStudent',
  components: {
    Navbar,
    StudentForm,
  },
  data() {
    return {
      student: null as Student | null,
      id: '',
      errorMessage: '',
      isLoading: false,
    }
  },
  mounted() {
    this.fetchStudent()
  },
  methods: {
    async fetchStudent() {
      this.isLoading = true

      const id = this.$route.params.id as string
      const response = await getStudent(id)
      if ('message' in response) {
        if (typeof response.message !== 'string') this.errorMessage = getMessage(response.message)
        else this.errorMessage = response.message as string

        this.isLoading = false
        return
      }

      this.student = response
      this.id = id
      this.isLoading = false
    },

    async editStudent(student: Student) {
      const response = await updateStudent(this.id, student)
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
  <section id="add-students" class="w-100 d-flex flex-column">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <h2>Edit Student Details</h2>
      <p>Please fill in the details below.</p>
      <div v-if="errorMessage" class="text-danger">Error: {{ errorMessage }}</div>
    </div>

    <div v-if="isLoading || !student" class="container bg-white rounded-3 my-5">
      <div
        v-if="isLoading"
        class="spinner-border text-primary d-block mx-auto my-5"
        role="status"
      ></div>
      <div v-else-if="!isLoading && !student" class="text-center my-5">
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg?semt=ais_incoming&w=740&q=80"
          alt="no data available"
          class="d-block mx-auto my-5 w-25"
        />
        <p class="text-center my-5">Student not found.</p>
      </div>
    </div>
    <StudentForm v-else :student="student" @formData="editStudent" />
  </section>
</template>
