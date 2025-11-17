<script setup lang="ts">
import { getCourses } from '@/helpers/api/courses'
import type { Course } from '@/models/courses'
import type { ValidationError } from '@/models/global'
import type { Student } from '@/models/students'
import { validateAll } from '@/helpers/validation/students'
import { onMounted, reactive, ref } from 'vue'

onMounted(() => {
  fetchCourses()
})

const props = defineProps<{ student?: Student; isLoading: boolean }>()
const student = reactive<Student>({
  id: undefined,
  studentId: '',
  firstName: '',
  lastName: '',
  email: '',
  age: 0,
  course: '',
  ...props.student,
})

/*<--------- FETCH COURSES --------->*/

const courses = ref<Course[]>([])
const controller = ref<AbortController | null>(null)
async function fetchCourses() {
  if (controller.value) controller.value.abort()
  controller.value = new AbortController()

  const response = await getCourses({ page: 0, size: 100 }, controller.value.signal)
  if (!response || 'message' in response) return

  courses.value = response.data
}

/*<--------- FORM SUBMIT --------->*/

const emit = defineEmits<{ (event: 'formData', value: Student): void }>()
function submitStudent() {
  if (!student) return

  errors.value = validateAll(student)
  if (errors.value.filter((e) => e.errors.length > 0).length > 0) return

  emit('formData', student)
}

/*<--------- ERROR HANDLING --------->*/

const errors = ref<ValidationError[]>([])
function getErrors(field: keyof Student): string[] {
  const errorObj = errors.value.find((e) => e.field === field)
  return errorObj ? errorObj.errors : []
}
</script>

<template>
  <form
    id="students--form"
    class="container bg-white p-5 rounded-3 my-5"
    @submit.prevent="submitStudent"
  >
    <div class="row g-4 mb-3">
      <div class="col-md-2">
        <label for="studentId" class="form-label">
          Student ID
          <span class="text-danger">*</span>
        </label>
        <input
          type="text"
          class="form-control-plaintext"
          id="studentId"
          placeholder="N/A"
          v-model="student.studentId"
          required
          readonly
        />
      </div>
      <div class="col-md-5">
        <label for="firstName" class="form-label">
          First Name
          <span class="text-danger">*</span>
        </label>
        <input
          type="text"
          class="form-control"
          id="firstName"
          placeholder="Jane"
          v-model="student.firstName"
          required
        />
        <div
          class="form-text text-danger mt-1"
          v-for="error in getErrors('firstName')"
          :key="error"
        >
          {{ error }}
        </div>
      </div>
      <div class="col-md-5">
        <label for="lastName" class="form-label">
          Last Name
          <span class="text-danger">*</span>
        </label>
        <input
          type="text"
          class="form-control"
          id="lastName"
          placeholder="Doe"
          v-model="student.lastName"
          required
        />
        <div class="form-text text-danger mt-1" v-for="error in getErrors('lastName')" :key="error">
          {{ error }}
        </div>
      </div>
    </div>
    <div class="row g-4 mb-3">
      <div class="col-md-5">
        <label for="email" class="form-label">
          Email Address
          <span class="text-danger">*</span>
        </label>
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="example@email.com"
          v-model="student.email"
          required
        />
        <div class="form-text text-danger mt-1" v-for="error in getErrors('email')" :key="error">
          {{ error }}
        </div>
      </div>
      <div class="col-md-2">
        <label for="age" class="form-label">
          Age
          <span class="text-danger">*</span>
        </label>
        <input type="number" class="form-control" id="age" placeholder="0" v-model="student.age" />
        <div class="form-text text-danger mt-1" v-for="error in getErrors('age')" :key="error">
          {{ error }}
        </div>
      </div>
      <div class="col-md-5">
        <label for="course" class="form-label">
          Course
          <span class="text-danger">*</span>
        </label>
        <select class="form-select" id="course" v-model="student.course" required>
          <option value="" disabled>Select a Course</option>
          <option v-for="course in courses" :key="course.id" :value="course.name">
            {{ course.name }}
          </option>
        </select>
        <div id="courseHelp" class="form-text">
          Create a new
          <a
            @click="$router.push('/courses/add')"
            class="text-primary text-underline"
            style="cursor: pointer"
            >course</a
          >
          if course does not exist.
        </div>
      </div>
    </div>
    <div class="d-flex flex-wrap mt-5 gap-4">
      <button type="button" class="btn btn-outline-primary flex-fill" @click="$router.back()">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary flex-fill" :disabled="isLoading">
        <div
          v-if="isLoading"
          class="spinner-border spinner-border-sm text-primary d-block mx-auto my-1"
          role="status"
        ></div>
        <span v-else> Save </span>
      </button>
    </div>
  </form>
</template>
