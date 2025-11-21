<script setup lang="ts">
import { validatePassword, validateUsername } from '@/helpers/validation/users'
import type { UserCredentials } from '@/models/users'
import { reactive } from 'vue'

const { label, submitError, isLoading, type } = defineProps<{
  label: string
  submitError?: string | null
  isLoading: boolean
  type: 'login' | 'signup'
}>()
const emit = defineEmits<{ (event: 'onUserSubmit', value: UserCredentials): void }>()
const isSigningUp = type === 'signup'

/*<--------- FORM SUBMIT --------->*/

const credentials = reactive<UserCredentials>({
  username: '',
  password: '',
})

function submitUser() {
  validateCredentials()
  if (errors.username.length > 0 || errors.password.length > 0 || errors.name.length > 0) return

  emit('onUserSubmit', credentials)
}

/*<--------- ERROR VALIDATION --------->*/

const errors = reactive<{ name: string[]; username: string[]; password: string[] }>({
  name: [],
  username: [],
  password: [],
})

function validateCredentials() {
  errors.username = []
  errors.password = []

  // check credentials
  errors.username = validateUsername(credentials.username).errors
  errors.password = validatePassword(credentials.password).errors

  if(isSigningUp && !credentials.name)
    errors.name = ['Name is required.']
}
</script>

<template>
  <form id="login--form" class="mt-4" @submit.prevent="submitUser">
    <div class="mb-3" v-if="isSigningUp">
      <label for="name" class="form-label">Display Name</label>
      <input
        type="text"
        class="form-control"
        id="name"
        v-model="credentials.name"
        placeholder="Enter your chosen name"
        required
      />
      <div class="form-text text-danger mt-1" v-for="(error, idx) in errors.name" :key="idx">
        {{ error }}
      </div>
    </div>
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input
        type="text"
        class="form-control"
        id="username"
        v-model="credentials.username"
        placeholder="Enter a unique username"
        required
      />
      <div class="form-text text-danger mt-1" v-for="(error, idx) in errors.username" :key="idx">
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
        placeholder="Enter a strong password"
        required
      />
      <div class="form-text text-danger mt-1" v-for="(error, idx) in errors.password" :key="idx">
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
