<script lang="ts">
import { signup } from '@/api/authorization'
import SuccessToast from '@/components/SuccessToast.vue'
import { getMessage } from '@/helpers/utils'
import { Toast } from 'bootstrap'

export default {
  name: 'Signup',
  components: {
    SuccessToast,
  },
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      },
      confirm_password: '',
      errors: {
        username: null as string | null,
        password: null as string | null,
        confirm_password: null as string | null,
        general: null as string | null,
      },
    }
  },
  methods: {
    checkCredentials() {
      this.errors = {
        username: null,
        password: null,
        confirm_password: null,
        general: null,
      }

      if (this.credentials.username.trim() === '')
        this.errors.username = 'Username cannot be blank.'

      if (this.credentials.password.trim() === '')
        this.errors.password = 'Password cannot be blank.'

      if (this.credentials.password !== this.confirm_password)
        this.errors.confirm_password = 'Passwords do not match.'
    },

    async signupUser(event: Event) {
      event.preventDefault()
      this.checkCredentials()
      if (this.errors.username || this.errors.password || this.errors.confirm_password) return

      const toast = document.getElementById('toast--success')
      const response = await signup(this.credentials)
      if ('message' in response) {
        if (typeof response.message !== 'string') this.errors.general = getMessage(response.message)
        else this.errors.general = response.message

        return
      }

      const toastInstance = new Toast(toast as HTMLElement)
      toastInstance.show()
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    },
  },
  watch: {
    credentials: {
      handler() {
        this.checkCredentials()
      },
      deep: true,
    },
    confirm_password() {
      this.checkCredentials()
    },
  },
}
</script>

<template>
  <section id="login" class="d-flex flex-column justify-content-center vh-100">
    <h3>Student Management System</h3>
    <form id="login--form" class="mt-4" @submit="signupUser">
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
      <div class="mb-3">
        <label for="confirm_password" class="form-label">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          id="confirm_password"
          v-model="confirm_password"
          required
        />
        <div v-if="errors.confirm_password" class="form-text text-danger mt-1">
          {{ errors.confirm_password }}
        </div>
      </div>

      <div v-if="errors.general" class="form-text text-danger mt-2">
        {{ errors.general }}
      </div>
      <button type="submit" class="btn btn-primary w-100 mt-3">Signup</button>
    </form>
    <div class="mt-3 text-center"><a class="mt-3 text-center" href="/">Back to Login</a></div>

    <SuccessToast message="Signup successful!" />
  </section>
</template>
