<script setup lang="ts">
import CredentialsForm from '@/components/CredentialsForm.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import { login } from '@/helpers/api/authorization'
import { useAuthorizationStore } from '@/helpers/stores/authorization'
import { getMessage, isError } from '@/helpers/utils'
import type { UserCredentials } from '@/models/users'
import { Toast } from 'bootstrap'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/*<--------- USER LOGIN --------->*/

const errorMessage = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const router = useRouter()

async function loginUser(credentials: UserCredentials) {
  isLoading.value = true
  const toast = document.getElementById('toast--login')

  const auth = useAuthorizationStore()
  const response = await login(credentials)

  if (isError(response)) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message

    isLoading.value = false
    return
  }

  auth.setToken(response.token)
  auth.setUserDetails(response)

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
    <credentials-form
      label="Login"
      :is-loading="isLoading"
      :submit-error="errorMessage"
      type="login"
      @on-user-submit="loginUser"
    />

    <div class="mt-3 text-center">
      Don't have an account?
      <span class="mt-3 text-center btn--link" @click="$router.push('/signup')">Sign up</span>
    </div>

    <success-toast id="toast--login" message="Login successful!" />
  </section>
</template>
