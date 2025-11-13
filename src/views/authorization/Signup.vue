<script lang="ts">
import { signup } from '@/helpers/api/authorization'
import CredentialsForm from '@/components/CredentialsForm.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import { getMessage } from '@/helpers/utils'
import type { UserCredentials } from '@/models/users'
import { Toast } from 'bootstrap'

export default {
  name: 'Signup',
  components: {
    SuccessToast,
    CredentialsForm,
  },
  data() {
    return {
      errorMessage: null as string | null,
    }
  },
  methods: {
    async signupUser(credentials: UserCredentials) {
      const toast = document.getElementById('toast--success')
      const response = await signup(credentials)
      if ('message' in response) {
        if (typeof response.message !== 'string') this.errorMessage = getMessage(response.message)
        else this.errorMessage = response.message

        return
      }

      const toastInstance = new Toast(toast as HTMLElement)
      toastInstance.show()
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    },
  },
}
</script>

<template>
  <section id="signup" class="d-flex flex-column justify-content-center vh-100">
    <h3>Student Management System</h3>
    <h5 class="text-center">Signup</h5>

    <CredentialsForm label="Signup" :submitError="errorMessage" @onUserSubmit="signupUser" />
    <div class="mt-3 text-center"><a class="mt-3 text-center" href="/">Back to Login</a></div>

    <SuccessToast message="Signup successful!" />
  </section>
</template>
