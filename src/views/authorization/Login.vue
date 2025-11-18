<script setup lang="ts">
import { login } from '@/helpers/api/authorization'
import CredentialsForm from '@/components/CredentialsForm.vue'
import { getMessage } from '@/helpers/utils'
import type { UserCredentials } from '@/models/users'
import { useAuthorizationStore } from '@/helpers/stores/authorization'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SuccessToast from '@/components/SuccessToast.vue'
import { Toast } from 'bootstrap'

/*<--------- USER LOGIN --------->*/

const errorMessage = ref<string | undefined>(undefined)
const isLoading = ref<boolean>(false)
const router = useRouter()

async function loginUser(credentials: UserCredentials) {
  isLoading.value = true
  const toast = document.getElementById('toast--success')

  const auth = useAuthorizationStore()
  const response = await login(credentials)

  if ('message' in response) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message

    return
  }

  auth.setToken(response.token)

  const toastInstance = new Toast(toast as HTMLElement)
  toastInstance.show()

  setTimeout(() => {
    isLoading.value = false
    router.push('/students')
  }, 500)
}
</script>

<template>
  <section id="login" class="d-flex flex-column justify-content-center vh-100">
    <h3>Student Management System</h3>
    <h5 class="text-center">Login</h5>
    <CredentialsForm
      label="Login"
      :isLoading="isLoading"
      :submitError="errorMessage"
      @onUserSubmit="loginUser"
    />

    <div class="mt-3 text-center">
      Don't have an account?
      <a class="mt-3 text-center" href="/signup">Sign up</a>
    </div>

    <SuccessToast message="Login successful!" />
  </section>
</template>
