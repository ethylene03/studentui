<script setup lang="ts">
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import StudentForm from '@/components/StudentForm.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import { addStudent } from '@/helpers/api/students'
import { getMessage, isError } from '@/helpers/utils'
import type { StudentDetails } from '@/models/students'
import { Toast } from 'bootstrap'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/*<--------- ADD STUDENT --------->*/

const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)
const router = useRouter()

async function createStudent(student: StudentDetails) {
  isLoading.value = true
  const toast = document.getElementById('toast--add-student')
  const response = await addStudent(student)

  if (isError(response)) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message

    isLoading.value = false
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
      <Header title="Add New Student" description="Please fill in the details below." type="Form" />
      <div v-if="errorMessage" class="text-danger">Error: {{ errorMessage }}</div>
    </div>

    <StudentForm @formData="createStudent" :isLoading="isLoading" />
    <SuccessToast id="toast--add-student" message="Student added successfully!" />
  </section>
</template>
