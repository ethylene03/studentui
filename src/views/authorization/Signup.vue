<script setup lang="ts">
import { signup } from '@/helpers/api/authorization'
import CredentialsForm from '@/components/CredentialsForm.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import { getMessage } from '@/helpers/utils'
import type { UserCredentials } from '@/models/users'
import { Toast } from 'bootstrap'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/*<--------- USER SIGNUP --------->*/

const errorMessage = ref<string | undefined>(undefined)
const isLoading = ref<boolean>(false)
const router = useRouter()

async function signupUser(credentials: UserCredentials) {
  isLoading.value = true

  const toast = document.getElementById('toast--signup')
  const response = await signup(credentials)
  if ('message' in response) {
    if (typeof response.message !== 'string') errorMessage.value = getMessage(response.message)
    else errorMessage.value = response.message

    return
  }

  const toastInstance = new Toast(toast as HTMLElement)
  toastInstance.show()
  setTimeout(() => {
    isLoading.value = false
    router.push('/')
  }, 500)
}
</script>

<template>
  <section id="signup" class="d-flex flex-column justify-content-center vh-100">
    <h3>Student Management System</h3>
    <h5 class="text-center">Signup</h5>

    <CredentialsForm
      label="Signup"
      :isLoading="isLoading"
      :submitError="errorMessage"
      @onUserSubmit="signupUser"
    />
    <div class="mt-3 text-center">
      <span class="mt-3 text-center btn--link" @click="$router.push('/')">Back to Login</span>
    </div>

    <SuccessToast id="toast--signup" message="Signup successful!" />
  </section>
</template>
