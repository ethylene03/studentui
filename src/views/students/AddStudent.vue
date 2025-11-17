<script setup lang="ts">
import { addStudent } from '@/helpers/api/students'
import Navbar from '@/components/Navbar.vue'
import StudentForm from '@/components/StudentForm.vue'
import { getMessage } from '@/helpers/utils'
import type { Student } from '@/models/students'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'bootstrap'
import SuccessToast from '@/components/SuccessToast.vue'

/*<--------- ADD STUDENT --------->*/

const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)
const router = useRouter()

async function createStudent(student: Student) {
  isLoading.value = true
  const toast = document.getElementById('toast--success')
  const response = await addStudent(student)

  if ('message' in response) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message as string

    return
  }

  const toastInstance = new Toast(toast as HTMLElement)
  toastInstance.show()

  setTimeout(() => {
    isLoading.value = false
    router.back()
  }, 500)
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

    <StudentForm @formData="createStudent" :isLoading="isLoading" />
    <SuccessToast message="Student added successfully!" />
  </section>
</template>
