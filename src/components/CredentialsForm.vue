<script lang="ts">
import type { UserCredentials } from '@/models/users'
import { validatePassword, validateUsername } from '@/helpers/validation/users'
import type { PropType } from 'vue'

export default {
  name: 'CredentialsForm',
  props: {
    label: {
      type: String,
      required: true,
    },
    submitError: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  data() {
    return {
      credentials: {} as UserCredentials,
      errors: {
        username: [] as string[],
        password: [] as string[],
      },
    }
  },
  methods: {
    submitUser(event: Event) {
      event.preventDefault()
      this.validateCredentials()
      if (this.errors.username.length > 0 || this.errors.password.length > 0) return

      this.$emit('onUserSubmit', this.credentials)
    },

    validateCredentials() {
      this.errors.username = []
      this.errors.password = []

      // check credentials
      this.errors.username = validateUsername(this.credentials.username).errors
      this.errors.password = validatePassword(this.credentials.password).errors
    },
  },
}
</script>

<template>
  <form id="login--form" class="mt-4" @submit="submitUser">
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
    <button type="submit" class="btn btn-primary w-100 mt-3">{{ label }}</button>
  </form>
</template>
