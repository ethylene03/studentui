<script setup lang="ts">
import CourseForm from '@/components/CourseForm.vue'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import NoData from '@/components/NoData.vue'
import Spinner from '@/components/Spinner.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import { getCourse, updateCourse } from '@/helpers/api/courses'
import { getMessage, isError } from '@/helpers/utils'
import type { CourseDetails } from '@/models/courses'
import { Toast } from 'bootstrap'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

onMounted(() => {
  fetchCourseData()
})

const router = useRouter()
const route = useRoute()

/*<--------- FETCH EXISTING COURSE --------->*/

const course = ref<CourseDetails | null>(null)
const id = ref<string>('')
const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)

async function fetchCourseData() {
  isLoading.value = true

  const routeID = route.params.id as string
  const response = await getCourse(routeID)

  if (isError(response)) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message

    isLoading.value = false
    return
  }

  course.value = response
  id.value = routeID
  isLoading.value = false
}

/*<--------- EDIT COURSE --------->*/

const editLoading = ref<boolean>(false)
async function editCourse(course: CourseDetails) {
  editLoading.value = true
  const toast = document.getElementById('toast--edit-course')
  const response = await updateCourse(id.value, course)

  if (isError(response)) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message

    editLoading.value = false
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
      <Header
        title="Edit Course Details"
        description="Please fill in the details below."
        type="Form"
      />
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
