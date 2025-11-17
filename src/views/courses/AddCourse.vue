<script setup lang="ts">
import { addCourse } from '@/helpers/api/courses'
import CourseForm from '@/components/CourseForm.vue'
import Navbar from '@/components/Navbar.vue'
import { getMessage } from '@/helpers/utils'
import type { Course } from '@/models/courses'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SuccessToast from '@/components/SuccessToast.vue'
import { Toast } from 'bootstrap'

/*<--------- ADD COURSE --------->*/

const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)
const router = useRouter()

async function createCourse(course: Course) {
  isLoading.value = true
  const toast = document.getElementById('toast--success')
  const response = await addCourse(course)

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
  <section id="add-courses" class="w-100 d-flex flex-column">
    <Navbar />

    <div class="container mt-5 text-center text-md-start">
      <h2>Add New Course</h2>
      <p>Please fill in the details below.</p>
      <div v-if="errorMessage" class="text-danger">Error: {{ errorMessage }}</div>
    </div>

    <CourseForm @formData="createCourse" :isLoading="isLoading" />
    <SuccessToast message="Course added successfully!" />
  </section>
</template>
