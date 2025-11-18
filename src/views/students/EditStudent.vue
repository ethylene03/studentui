<script setup lang="ts">
import { getStudent, updateStudent } from '@/helpers/api/students'
import Navbar from '@/components/Navbar.vue'
import NoData from '@/components/NoData.vue'
import Spinner from '@/components/Spinner.vue'
import StudentForm from '@/components/StudentForm.vue'
import { getMessage } from '@/helpers/utils'
import type { Student } from '@/models/students'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'bootstrap'
import SuccessToast from '@/components/SuccessToast.vue'

onMounted(() => {
  fetchStudent()
})

const router = useRouter()
const route = useRoute()

/*<--------- FETCH EXISTING STUDENT --------->*/

const student = ref<Student | null>(null)
const id = ref<string>('')
const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)

async function fetchStudent() {
  isLoading.value = true

  const routeID = route.params.id as string
  const response = await getStudent(routeID)
  if ('message' in response) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message as string

    isLoading.value = false
    return
  }

  student.value = response
  id.value = routeID
  isLoading.value = false
}

/*<--------- EDIT STUDENT --------->*/

const editLoading = ref<boolean>(false)
async function editStudent(student: Student) {
  editLoading.value = true
  const toast = document.getElementById('toast--edit-student')
  const response = await updateStudent(id.value, student)
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

    <StudentForm v-else :student="student" @formData="editStudent" :isLoading="editLoading" />
    <SuccessToast id="toast--edit-student" message="Student updated successfully!" />
  </section>
</template>
