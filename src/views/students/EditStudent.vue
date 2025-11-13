<script lang="ts">
import { getStudent, updateStudent } from '@/api/students'
import Navbar from '@/components/Navbar.vue'
import NoData from '@/components/NoData.vue'
import Spinner from '@/components/Spinner.vue'
import StudentForm from '@/components/StudentForm.vue'
import { getMessage } from '@/helpers/utils'
import type { Student } from '@/models/students'

export default {
  name: 'EditStudent',
  components: {
    Navbar,
    StudentForm,
    Spinner,
    NoData,
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
      <Spinner v-if="isLoading" />
      <NoData v-else-if="!isLoading && !student" message="Student not found." />
    </div>
    <StudentForm v-else :student="student" @formData="editStudent" />
  </section>
</template>
