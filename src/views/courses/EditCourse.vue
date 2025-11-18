<script setup lang="ts">
import { getCourse, updateCourse } from '@/helpers/api/courses'
import CourseForm from '@/components/CourseForm.vue'
import Navbar from '@/components/Navbar.vue'
import NoData from '@/components/NoData.vue'
import Spinner from '@/components/Spinner.vue'
import { getMessage } from '@/helpers/utils'
import type { Course } from '@/models/courses'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SuccessToast from '@/components/SuccessToast.vue'
import { Toast } from 'bootstrap'

onMounted(() => {
  fetchCourseData()
})

const router = useRouter()
const route = useRoute()

/*<--------- FETCH EXISTING COURSE --------->*/

const course = ref<Course | null>(null)
const id = ref<string>('')
const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)

async function fetchCourseData() {
  isLoading.value = true

  const routeID = route.params.id as string
  const response = await getCourse(routeID)

  if ('message' in response) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message as string

    isLoading.value = false
    return
  }

  course.value = response
  id.value = routeID
  isLoading.value = false
}

/*<--------- EDIT COURSE --------->*/

const editLoading = ref<boolean>(false)
async function editCourse(course: Course) {
  editLoading.value = true
  const toast = document.getElementById('toast--edit-course')
  const response = await updateCourse(id.value, course)

  if ('message' in response) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message as string

    return
  }

  const toastInstance = new Toast(toast as HTMLElement)
  toastInstance.show()

  setTimeout(() => {
    editLoading.value = false
    router.back()
  }, 500)
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

    <CourseForm v-else :course="course" @formData="editCourse" :isLoading="editLoading" />
    <SuccessToast id="toast--edit-course" message="Course updated successfully!" />
  </section>
</template>
