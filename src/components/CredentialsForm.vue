<script setup lang="ts">
import { validatePassword, validateUsername } from '@/helpers/validation/users'
import type { UserCredentials } from '@/models/users'
import { reactive } from 'vue'

const { label, submitError, isLoading } = defineProps<{
  label: string
  submitError?: string
  isLoading: boolean
}>()
const emit = defineEmits<{ (event: 'onUserSubmit', value: UserCredentials): void }>()

/*<--------- FORM SUBMIT --------->*/

const credentials = reactive<UserCredentials>({
  username: '',
  password: '',
})

function submitUser() {
  validateCredentials()
  if (errors.username.length > 0 || errors.password.length > 0) return

  emit('onUserSubmit', credentials)
}

/*<--------- ERROR VALIDATION --------->*/

const errors = reactive<{ username: string[]; password: string[] }>({
  username: [],
  password: [],
})

function validateCredentials() {
  errors.username = []
  errors.password = []

  // check credentials
  errors.username = validateUsername(credentials.username).errors
  errors.password = validatePassword(credentials.password).errors
}
</script>

<template>
  <form id="login--form" class="mt-4" @submit.prevent="submitUser">
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input
        type="username"
        class="form-control"
        id="username"
        v-model="credentials.username"
        required
      />
      <div class="form-text text-danger mt-1" v-for="error in errors.username">
        {{ error }}
      </div>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        type="password"
        class="form-control"
        id="password"
        v-model="credentials.password"
        required
      />
      <div class="form-text text-danger mt-1" v-for="error in errors.password">
        {{ error }}
      </div>
    </div>
    <div v-if="submitError" class="form-text text-danger mt-2">
      {{ submitError }}
    </div>
    <button type="submit" class="btn btn-primary w-100 mt-3" :disabled="isLoading">
      <div
        v-if="isLoading"
        class="spinner-border spinner-border-sm text-primary d-block mx-auto my-1"
        role="status"
      ></div>
      <span v-else>{{ label }}</span>
    </button>
  </form>
</template>
