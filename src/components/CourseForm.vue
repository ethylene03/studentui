<script lang="ts">
import type { Course } from '@/models/courses'
import { validateCourseName } from '@/validation/courses'
import type { PropType } from 'vue'

export default {
  name: 'CourseForm',
  props: {
    course: {
      type: Object as PropType<Course>,
      default: () => ({
        name: '',
      }),
    },
  },
  data() {
    return {
      courseCopy: { ...this.course },
      errors: [] as string[],
    }
  },
  methods: {
    submitCourse() {
      if (!this.courseCopy) return

      this.errors = validateCourseName(this.courseCopy.name).errors
      if (this.errors.length > 0) return

      this.$emit('formData', this.courseCopy)
    },
  },
}
</script>

<template>
  <form id="courses--form" class="container mt-5" @submit.prevent="submitCourse">
    <div class="flex-fill">
      <label for="name" class="form-label">
        Course Name
        <span class="text-danger">*</span>
      </label>
      <input
        type="text"
        class="form-control"
        id="name"
        placeholder="Computer Science"
        v-model="courseCopy.name"
        required
      />
      <div class="form-text text-danger mt-1" v-for="error in errors" :key="error">
        {{ error }}
      </div>
    </div>
    <div class="d-flex flex-wrap mt-5 gap-4">
      <button
        type="button"
        class="btn btn-light border border-primary-subtle flex-fill"
        @click="$router.back()"
      >
        Cancel
      </button>
      <button type="submit" class="btn btn-primary flex-fill">Add Course</button>
    </div>
  </form>
</template>
