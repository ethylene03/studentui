<script setup lang="ts">
import DataSpinner from '@/components/DataSpinner.vue'
import NavBar from '@/components/NavBar.vue'
import NoData from '@/components/NoData.vue'
import PageHeader from '@/components/PageHeader.vue'
import StudentForm from '@/components/StudentForm.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import { getStudent, updateStudent } from '@/helpers/api/students'
import { getMessage, isError } from '@/helpers/utils'
import type { Student, StudentDetails } from '@/models/students'
import { Toast } from 'bootstrap'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  if (isError(response)) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message

    isLoading.value = false
    return
  }

  student.value = response
  id.value = routeID
  isLoading.value = false
}

/*<--------- EDIT STUDENT --------->*/

const editLoading = ref<boolean>(false)
async function editStudent(student: StudentDetails) {
  editLoading.value = true
  const toast = document.getElementById('toast--edit-student')
  const response = await updateStudent(id.value, student)
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
  <section id="add-students" class="w-100 d-flex flex-column">
    <nav-bar />

    <div class="container mt-5 text-center text-md-start">
      <page-header
        title="Edit Student Details"
        description="Please fill in the details below."
        type="Form"
      />
      <div v-if="errorMessage" class="text-danger">Error: {{ errorMessage }}</div>
    </div>

    <div v-if="isLoading || !student" class="container bg-white rounded-3 my-5">
      <data-spinner v-if="isLoading" />
      <no-data v-else-if="!isLoading && !student" message="Student not found." />
    </div>

    <student-form v-else :student="student" @form-data="editStudent" :is-loading="editLoading" />
    <success-toast id="toast--edit-student" message="Student updated successfully!" />
  </section>
</template>
