<script setup lang="ts">
import { validateCourseName } from '@/helpers/validation/courses'
import type { Course } from '@/models/courses'
import { reactive } from 'vue'

const props = defineProps<{ course?: Partial<Course> }>()
const course = reactive<Course>({
  id: undefined,
  name: '',
  ...props.course,
})

let errors = reactive<string[]>([])
const emit = defineEmits<{
  (event: 'formData', value: Course): void
}>()

function submitCourse() {
  if (!course) return

  errors = validateCourseName(course.name).errors
  if (errors.length > 0) return

  emit('formData', course)
}
</script>

<template>
  <form
    id="courses--form"
    class="container bg-white rounded-3 p-5 mt-5"
    @submit.prevent="submitCourse"
  >
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
        v-model="course.name"
        required
      />
      <div class="form-text text-danger mt-1" v-for="error in errors" :key="error">
        {{ error }}
      </div>
    </div>
    <div class="d-flex flex-wrap mt-5 gap-4">
      <button type="button" class="btn btn-outline-primary flex-fill" @click="$router.back()">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary flex-fill">Save</button>
    </div>
  </form>
</template>
