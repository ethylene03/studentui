<script lang="ts">
import { getCourses } from '@/api/courses'
import type { Course } from '@/models/courses'
import type { ValidationError } from '@/models/global'
import type { Student } from '@/models/students'
import { validateAll } from '@/validation/students'
import type { PropType } from 'vue'

export default {
  name: 'StudentForm',
  props: {
    student: {
      type: Object as PropType<Student>,
      default: () => ({
        firstName: '',
        lastName: '',
        birthDate: new Date(),
        age: 0,
        email: '',
        course: '',
      }),
    },
  },
  data() {
    return {
      studentCopy: { ...this.student },
      courses: [] as Course[],
      errors: [] as ValidationError[],
    }
  },
  mounted() {
    this.fetchCourses()
  },
  methods: {
    async fetchCourses() {
      const response = await getCourses({ page: 0, size: 100 })
      if ('message' in response) {
        console.error('Error fetching courses:', response.message)
        return
      }

      this.courses = response.data
    },

    submitStudent() {
      if (!this.studentCopy) return

      this.errors = validateAll(this.studentCopy)
      console.log(this.errors)
      if (this.errors.filter((e) => e.errors.length > 0).length > 0) return

      this.$emit('formData', this.studentCopy)
    },

    getErrors(field: keyof Student): string[] {
      const errorObj = this.errors.find((e) => e.field === field)
      return errorObj ? errorObj.errors : []
    },
  },
}
</script>

<template>
  <form id="students--form" class="container my-5" @submit.prevent="submitStudent">
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
          v-model="studentCopy.studentId"
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
          v-model="studentCopy.firstName"
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
          v-model="studentCopy.lastName"
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
          v-model="studentCopy.email"
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
        <input
          type="number"
          class="form-control"
          id="age"
          placeholder="0"
          v-model="studentCopy.age"
        />
        <div class="form-text text-danger mt-1" v-for="error in getErrors('age')" :key="error">
          {{ error }}
        </div>
      </div>
      <div class="col-md-5">
        <label for="course" class="form-label">
          Course
          <span class="text-danger">*</span>
        </label>
        <select class="form-select" id="course" v-model="studentCopy.course" required>
          <option value="" disabled>Select a Course</option>
          <option v-for="course in courses" :key="course.id" :value="course.name">
            {{ course.name }}
          </option>
        </select>
        <div id="courseHelp" class="form-text">
          Create a new <a href="/courses/add">course</a> if course does not exist.
        </div>
      </div>
    </div>
    <div class="d-flex flex-wrap mt-5 gap-4">
      <button
        type="button"
        class="btn btn-outline-primary bg-white flex-fill"
        @click="$router.back()"
      >
        Cancel
      </button>
      <button type="submit" class="btn btn-primary flex-fill">Add Student</button>
    </div>
  </form>
</template>
