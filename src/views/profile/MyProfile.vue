<script setup lang="ts">
import DeleteModal from '@/components/DeleteModal.vue'
import NavBar from '@/components/NavBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import SuccessToast from '@/components/SuccessToast.vue'
import { logout } from '@/helpers/api/authorization'
import { useDeleteItem } from '@/helpers/composables/deleteItem'
import { useSubmitUser } from '@/helpers/composables/submitUser'
import { useAuthorizationStore } from '@/helpers/stores/authorization'
import type { UserProfile } from '@/models/users'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  fetchUserProfile()
})

const { showDeleteModal, deleteItem } = useDeleteItem('user')
const { errorMessage, isChangePassword, isChangeUsername, isLoading, submitUser } = useSubmitUser()
const router = useRouter()

/*<--------- FORM STATE --------->*/

function handleEdit(edit: boolean) {
  isChangeUsername.value = edit
  isChangePassword.value = !edit
}

/*<--------- USER PROFILE --------->*/

const userId = ref('')
const user = ref<UserProfile>({})
const userStore = useAuthorizationStore()

function fetchUserProfile() {
  user.value = {}
  userId.value = userStore.id
  user.value = {
    name: userStore.name,
    username: userStore.username,
  }
}

/*<--------- SUBMIT USER PROFILE --------->*/

async function submitUserProfile() {
  await submitUser(user.value)
  resetPage()
}

/*<--------- CANCEL EDITING --------->*/

function resetPage() {
  isChangeUsername.value = false
  isChangePassword.value = false
  errorMessage.value = ''
  fetchUserProfile()
}

/*<--------- DELETE ACCOUNT --------->*/

async function deleteAccount() {
  await deleteItem()
  await logout()
  userStore.clearToken()

  setTimeout(() => {
    router.push('/')
  }, 1000)
}
</script>

<template>
  <section id="profile" class="w-100">
    <nav-bar />
    <div class="container mt-5 text-center text-md-start">
      <page-header title="My Profile" :description="'Welcome, ' + user.name" type="Main" />
      <div
        id="profile--menu"
        class="my-5 d-flex flex-column flex-md-row-reverse gap-3 justify-content-start"
      >
        <button class="btn btn-primary px-5" @click="handleEdit(true)" :disabled="isChangeUsername">
          Change Username
        </button>
        <button
          class="btn btn-outline-primary px-5"
          @click="handleEdit(false)"
          :disabled="isChangePassword"
        >
          Change Password
        </button>
        <button class="btn btn-outline-danger px-5" @click="showDeleteModal(userId)">
          Delete Account
        </button>
      </div>
    </div>

    <form class="container bg-white rounded-3 p-4 p-md-5 mb-3" @submit.prevent="submitUserProfile">
      <div class="input-group-text mb-4 gap-3">
        <label for="userId" class="w-25">User ID</label>
        <input
          id="userId"
          type="text"
          class="form-control-plaintext text-primary"
          placeholder="User ID"
          v-model="userId"
          readonly
        />
      </div>

      <div class="input-group-text mb-4 gap-3">
        <label for="name" class="w-25">Display Name</label>
        <input
          id="name"
          type="text"
          class="form-control-plaintext text-primary"
          placeholder="Display Name"
          v-model="user.name"
          readonly
        />
      </div>

      <div class="input-group-text mb-4 gap-3">
        <label for="username" class="w-25">Username</label>
        <input
          id="username"
          type="text"
          :class="
            'form-control' +
            (isChangePassword || !isChangeUsername ? '-plaintext text-primary' : '')
          "
          placeholder="Username"
          v-model="user.username"
          :readonly="isChangePassword || !isChangeUsername"
        />
      </div>

      <div v-if="isChangePassword || isChangeUsername" class="input-group-text mb-4 gap-3">
        <label for="oldPassword" class="w-25">Current Password</label>
        <input
          id="oldPassword"
          type="password"
          class="form-control"
          placeholder="Current Password"
          v-model="user.password"
        />
      </div>

      <div v-if="isChangePassword" class="input-group-text mb-4 gap-3">
        <label for="newPassword" class="w-25">New Password</label>
        <input
          id="newPassword"
          type="password"
          class="form-control"
          placeholder="New Password"
          v-model="user.newPassword"
        />
      </div>

      <p class="text-danger">{{ errorMessage }}</p>

      <div v-if="isChangePassword || isChangeUsername" class="d-flex gap-4 mt-5">
        <button type="button" class="btn btn-outline-primary flex-fill" @click="resetPage">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary flex-fill" :disabled="isLoading">
          <div v-if="isLoading" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span v-else> Save Changes </span>
        </button>
      </div>
    </form>
    <success-toast id="toast--update" message="Profile updated successfully!" />
    <success-toast id="toast--delete" message="Success! Logging you out.." />
    <delete-modal @delete="deleteAccount" />
  </section>
</template>

<style scoped>
.input-group-text {
  text-align: left;
  font-weight: 500;
}

@media screen and (max-width: 576px) {
  .input-group-text {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
