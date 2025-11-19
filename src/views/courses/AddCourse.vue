<script setup lang="ts">
import CourseForm from '@/components/CourseForm.vue'
import NavBar from '@/components/NavBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import { addCourse } from '@/helpers/api/courses'
import { getMessage, isError } from '@/helpers/utils'
import type { CourseDetails } from '@/models/courses'
import { Toast } from 'bootstrap'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/*<--------- ADD COURSE --------->*/

const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)
const router = useRouter()

async function createCourse(course: CourseDetails) {
  isLoading.value = true
  const toast = document.getElementById('toast--add-course')
  const response = await addCourse(course)

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
  <section id="add-courses" class="w-100 d-flex flex-column">
    <nav-bar />

    <div class="container mt-5 text-center text-md-start">
      <page-header
        title="Add New Course"
        description="Please fill in the details below."
        type="Form"
      />
      <div v-if="errorMessage" class="text-danger">Error: {{ errorMessage }}</div>
    </div>

    <course-form @form-data="createCourse" :is-loading="isLoading" />
    <success-toast id="toast--add-course" message="Course added successfully!" />
  </section>
</template>
