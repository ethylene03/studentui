import type { ErrorResponse } from '@/models/global'
import type { User, UserProfile } from '@/models/users'
import { Toast } from 'bootstrap'
import { ref } from 'vue'
import { changePassword, changeUsername } from '../api/users'
import { useAuthorizationStore } from '../stores/authorization'
import { getMessage, isError } from '../utils'

export function useSubmitUser() {
  const errorMessage = ref<string>('')
  const isChangePassword = ref<boolean>(false)
  const isChangeUsername = ref<boolean>(false)
  const isLoading = ref(false)

  const userStore = useAuthorizationStore()

  async function submitUser(user: UserProfile) {
    isLoading.value = true
    const toast = document.getElementById('toast--update')
    const toastInstance = new Toast(toast as HTMLElement)
    let response: User | ErrorResponse

    if (isChangePassword.value) {
      response = await changePassword(userStore.id, {
        username: user.username as string,
        oldPassword: user.password as string,
        newPassword: user.newPassword as string,
      })
    } else if (isChangeUsername.value) {
      response = await changeUsername(userStore.id, {
        username: user.username as string,
        password: user.password as string,
      })
    } else {
      isLoading.value = false
      return
    }

    if (isError(response)) {
      errorMessage.value =
        typeof response.message === 'string' ? response.message : getMessage(response.message)

      isLoading.value = false
      return
    }

    userStore.setUserDetails(response)

    toastInstance.show()
    isLoading.value = false
  }

  return { errorMessage, isChangePassword, isChangeUsername, isLoading, submitUser }
}
