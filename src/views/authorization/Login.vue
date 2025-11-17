<script setup lang="ts">
import { login } from '@/helpers/api/authorization'
import CredentialsForm from '@/components/CredentialsForm.vue'
import { getMessage } from '@/helpers/utils'
import type { UserCredentials } from '@/models/users'
import { useAuthorizationStore } from '@/helpers/stores/authorization'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/*<--------- USER LOGIN --------->*/

const errorMessage = ref<string | undefined>(undefined)
const router = useRouter()

async function loginUser(credentials: UserCredentials) {
  const auth = useAuthorizationStore()
  const response = await login(credentials)

  if ('message' in response) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message

    return
  }

  auth.setToken(response.token)
  auth.refreshTime()
  router.push('/students')
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
