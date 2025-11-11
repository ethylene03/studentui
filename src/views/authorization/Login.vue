<script lang="ts">
import { login } from '@/api/authorization'
import { getMessage } from '@/helpers/utils'
import { useAuthorizationStore } from '@/stores/authorization'

export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      },
      errors: {
        username: null as string | null,
        password: null as string | null,
        general: null as string | null,
      },
    }
  },
  methods: {
    async loginUser(event: Event) {
      event.preventDefault()
      this.errors.username = null
      this.errors.password = null

      // check credentials
      if (this.credentials.username.trim() === '')
        this.errors.username = 'Username cannot be blank.'

      if (this.credentials.password.trim() === '')
        this.errors.password = 'Password cannot be blank.'

      if (this.errors.username || this.errors.password) return

      // login user
      const auth = useAuthorizationStore()
      const response = await login(this.credentials)
      if ('message' in response) {
        if (typeof response.message !== 'string') this.errors.general = getMessage(response.message)
        else this.errors.general = response.message

        return
      }

      auth.setToken(response.token)
      auth.refreshTime()
      this.$router.push('/students')
    },
  },
}
</script>

<template>
  <section id="login" class="d-flex flex-column justify-content-center vh-100">
    <h3>Student Management System</h3>
    <form id="login--form" class="mt-4" @submit="loginUser">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          type="username"
          class="form-control"
          id="username"
          v-model="credentials.username"
          required
        />
        <div v-if="errors.username" class="form-text text-danger mt-1">{{ errors.username }}</div>
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
        <div v-if="errors.password" class="form-text text-danger mt-1">{{ errors.password }}</div>
      </div>
      <div v-if="errors.general" class="form-text text-danger mt-2">
        {{ errors.general }}
      </div>
      <button type="submit" class="btn btn-primary w-100 mt-3">Login</button>
    </form>
    <div class="mt-3 text-center">
      Don't have an account? <a class="mt-3 text-center" href="/signup">Sign up</a>
    </div>
  </section>
</template>
