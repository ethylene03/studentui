<script lang="ts">
import { login } from '@/helpers/api/authorization'
import CredentialsForm from '@/components/CredentialsForm.vue'
import { getMessage } from '@/helpers/utils'
import type { UserCredentials } from '@/models/users'
import { useAuthorizationStore } from '@/helpers/stores/authorization'

export default {
  name: 'Login',
  components: {
    CredentialsForm,
  },
  data() {
    return {
      errorMessage: null as string | null,
    }
  },
  methods: {
    async loginUser(credentials: UserCredentials) {
      // login user
      const auth = useAuthorizationStore()
      const response = await login(credentials)

      if ('message' in response) {
        if (typeof response.message !== 'string') this.errorMessage = getMessage(response.message)
        else this.errorMessage = response.message

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
    <h5 class="text-center">Login</h5>
    <CredentialsForm label="Login" :submitError="errorMessage" @onUserSubmit="loginUser" />

    <div class="mt-3 text-center">
      Don't have an account?
      <a class="mt-3 text-center" href="/signup">Sign up</a>
    </div>
  </section>
</template>
